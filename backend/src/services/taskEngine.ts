import { prisma } from '../index';
import { analyzeEmailWithAI, generateDraftResponse } from './ai';

export const processInboundEmail = async (emailId: string) => {
  const email = await prisma.emailMessage.findUnique({ where: { id: emailId } });
  if (!email || email.isProcessed) return;

  try {
    // 1. Analyze Email
    const analysis = await analyzeEmailWithAI(email.subject || '', email.body);

    // 2. Create or Update Lead
    let lead = await prisma.lead.findFirst({ where: { email: email.from } });
    
    if (!lead) {
      lead = await prisma.lead.create({
        data: {
          emailMessageId: email.id,
          name: analysis.name,
          email: email.from,
          company: analysis.company,
          intent: analysis.intent,
          status: 'NEW',
        }
      });
    }

    // 3. Generate Task based on Analysis
    if (analysis.suggestedAction !== 'IGNORE') {
      let payload: any = { intent: analysis.intent };

      if (analysis.suggestedAction === 'DRAFT_RESPONSE') {
         payload.draftText = await generateDraftResponse(analysis, email.body);
      }

      await prisma.task.create({
        data: {
          emailMessageId: email.id,
          type: analysis.suggestedAction as any,
          payload: payload,
          status: 'PENDING_APPROVAL'
        }
      });
    }

    // 4. Mark email as processed
    await prisma.emailMessage.update({
      where: { id: email.id },
      data: { isProcessed: true }
    });

  } catch (error) {
    console.error("Failed to process email", error);
  }
};
