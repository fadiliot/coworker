import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
export const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import webhookRoutes from './routes/webhooks';
import taskRoutes from './routes/tasks';
import authRoutes from './routes/auth';

// Initialize background monitor
import './services/monitor';

app.use('/api/webhooks', webhookRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/auth', authRoutes);

// Health Check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// Start Server
app.listen(port, () => {
  console.log(`🚀 AI Sales Assistant Backend is running on port ${port}`);
});
