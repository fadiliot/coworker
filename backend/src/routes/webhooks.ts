import { Router, Request, Response } from 'express';
import { prisma } from '../index';
import { processInboundEmail } from '../services/taskEngine';

const router = Router();

// Webhook endpoint to receive incoming emails
// Simulating an inbound email parse webhook (e.g. from SendGrid or Mailgun)
router.post('/inbound-email', async (req: Request, res: Response): Promise<void> => {
  const { from, to, subject, text } = req.body;

  if (!from || !to || !text) {
    res.status(400).json({ error: 'Missing required email fields' });
    return;
  }

  try {
    // 1. Find the Account associated with the "to" email address
    const account = await prisma.account.findUnique({
      where: { emailAddress: to }
    });

    if (!account) {
       res.status(404).json({ error: 'Account not found for the given "to" address' });
       return;
    }

    // 2. Save raw email to DB
    const emailMessage = await prisma.emailMessage.create({
      data: {
        accountId: account.id,
        messageId: `msg-${Date.now()}-${Math.random().toString(36).substring(7)}`,
        subject: subject || 'No Subject',
        from: from,
        to: to,
        body: text,
        receivedAt: new Date()
      }
    });

    // 3. Trigger processing asynchronously
    processInboundEmail(emailMessage.id).catch(err => {
      console.error("Background processing failed", err);
    });

    res.status(200).json({ message: 'Email received and queued for processing', id: emailMessage.id });
  } catch (error) {
    console.error('Failed to ingest email:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
