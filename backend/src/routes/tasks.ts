import { Router, Request, Response } from 'express';
import { prisma } from '../index';
import { authenticate } from '../middleware/auth';
import { executeTask } from '../services/executor';

const router = Router();

// Get pending tasks
router.get('/', authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    const tasks = await prisma.task.findMany({
      where: { status: 'PENDING_APPROVAL' },
      include: {
        emailMessage: {
          include: { account: true, leads: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// Approve or Reject a task
router.post('/:id/action', authenticate, async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id as string;
  const { action, editedPayload, comment } = req.body;
  const userId = req.user!.userId;

  if (!['APPROVE', 'REJECT', 'EDIT_AND_APPROVE'].includes(action)) {
    res.status(400).json({ error: 'Invalid action' });
    return;
  }

  try {
    const task = await prisma.task.findUnique({ where: { id } });
    if (!task) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }
    if (task.status !== 'PENDING_APPROVAL') {
      res.status(400).json({ error: 'Task is not pending approval' });
      return;
    }

    const newStatus = action === 'REJECT' ? 'REJECTED' : 'APPROVED';
    const finalPayload = action === 'EDIT_AND_APPROVE' && editedPayload ? editedPayload : task.payload;

    // Transaction to update task and create log
    await prisma.$transaction(async (tx) => {
      await tx.task.update({
        where: { id },
        data: {
          status: newStatus,
          payload: finalPayload as any
        }
      });

      await tx.taskApprovalLog.create({
        data: {
          taskId: id,
          userId: userId,
          action: action,
          comment: comment
        }
      });
    });

    // Execute the task if it was approved
    if (newStatus === 'APPROVED') {
       executeTask(id).catch(err => console.error("Async execution failed:", err));
    }
    
    res.json({ message: `Task ${newStatus.toLowerCase()} successfully` });

  } catch (error) {
    console.error("Task action failed", error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
