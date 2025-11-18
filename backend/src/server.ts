import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

// Import routes
import coffeesRouter from './routes/coffees';
import usageRouter from './routes/usage';
import machinesRouter from './routes/machines';
import recipesRouter from './routes/recipes';
import machineUsageRouter from './routes/machineUsage';
import statsRouter from './routes/stats';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

export const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'CoffeeTracker API is running!' });
});

app.use('/api/coffees', coffeesRouter);
app.use('/api/usage', usageRouter);
app.use('/api/machines', machinesRouter);
app.use('/api/recipes', recipesRouter);
app.use('/api/machine-usage', machineUsageRouter);
app.use('/api/stats', statsRouter);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: any) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
