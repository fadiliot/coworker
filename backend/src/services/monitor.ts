import cron from 'node-cron';
import { prisma } from '../index';
import { fetchNewEmails, getGraphClient } from './graph';
import { processInboundEmail } from './taskEngine';

// Run every 2 minutes
cron.schedule('*/2 * * * *', async () => {
  console.log('🔄 Running email monitor cron job...');
  
  try {
    // Get all connected Microsoft accounts
    const accounts = await prisma.account.findMany({
      where: { provider: 'microsoft', accessToken: { not: '' } }
    });

    for (const account of accounts) {
      try {
        console.log(`Checking inbox for ${account.emailAddress}...`);
        const messages = await fetchNewEmails(account.id);
        const client = await getGraphClient(account.id);

        for (const msg of messages) {
          // Check if we already processed this messageId
          const existing = await prisma.emailMessage.findUnique({
             where: { messageId: msg.id }
          });

          if (!existing) {
            console.log(`New email detected: ${msg.subject}`);
            
            const fromAddress = msg.from?.emailAddress?.address || 'unknown';
            const toAddress = msg.toRecipients?.[0]?.emailAddress?.address || account.emailAddress;

            // Save to DB
            const newDbMessage = await prisma.emailMessage.create({
              data: {
                accountId: account.id,
                messageId: msg.id,
                conversationId: msg.conversationId,
                subject: msg.subject,
                from: fromAddress,
                to: toAddress,
                body: msg.body?.content || msg.bodyPreview || '',
                receivedAt: new Date(msg.receivedDateTime)
              }
            });

            // Mark as read in Microsoft Graph so we don't process it again
            await client.api(`/me/messages/${msg.id}`).patch({ isRead: true });

            // Trigger AI Pipeline
            await processInboundEmail(newDbMessage.id);
          }
        }
      } catch (err) {
        console.error(`Error monitoring account ${account.emailAddress}:`, err);
      }
    }
  } catch (error) {
    console.error('Error in monitor cron job:', error);
  }
});

console.log('✅ Email monitor service initialized.');
