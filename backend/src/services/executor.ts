import { prisma } from '../index';
import { sendEmail } from './graph';

export const executeTask = async (taskId: string) => {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: {
      emailMessage: {
        include: { account: true, leads: true }
      }
    }
  });

  if (!task || task.status !== 'APPROVED') {
    throw new Error('Task not found or not approved');
  }

  try {
    const payload = task.payload as any;
    const emailMessage = task.emailMessage;

    if (task.type === 'DRAFT_RESPONSE') {
      if (!emailMessage || !emailMessage.account) throw new Error("Cannot send email without original message context");
      
      const to = emailMessage.from; // Reply to the sender
      const subject = `Re: ${emailMessage.subject}`;
      const body = payload.draftText;

      console.log(`Executing DRAFT_RESPONSE task to ${to}...`);
      await sendEmail(emailMessage.account.id, to, subject, body, emailMessage.conversationId || undefined);

      await prisma.task.update({
        where: { id: task.id },
        data: { status: 'EXECUTED' }
      });
      console.log('Task executed successfully.');
    }
    else if (task.type === 'SCHEDULE_FOLLOW_UP') {
      // Logic for delayed execution (usually picked up by another cron job if scheduledFor > now)
      // For immediate execution if the date is passed:
      const lead = emailMessage?.leads[0];
      if (lead) {
         console.log(`Executing SCHEDULE_FOLLOW_UP task to ${lead.email}...`);
         await sendEmail(emailMessage!.account.id, lead.email, 'Following up!', payload.draftText || 'Just checking in.');
         await prisma.task.update({
           where: { id: task.id },
           data: { status: 'EXECUTED' }
         });
      }
    }
    // Handle UPDATE_CRM etc...

  } catch (error) {
    console.error(`Failed to execute task ${taskId}:`, error);
    await prisma.task.update({
      where: { id: task.id },
      data: { status: 'FAILED' }
    });
  }
};
