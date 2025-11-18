import { Router, Request, Response } from 'express';
import { prisma } from '../server';

const router = Router();

// Get all usage logs
router.get('/', async (req: Request, res: Response) => {
  try {
    const usageLogs = await prisma.usageLog.findMany({
      orderBy: { usageDate: 'desc' },
      include: {
        coffee: true,
      },
    });
    res.json(usageLogs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch usage logs' });
  }
});

// Get usage logs for specific coffee
router.get('/coffee/:coffeeId', async (req: Request, res: Response) => {
  try {
    const { coffeeId } = req.params;
    const usageLogs = await prisma.usageLog.findMany({
      where: { coffeeId: parseInt(coffeeId) },
      orderBy: { usageDate: 'desc' },
      include: {
        coffee: true,
      },
    });
    res.json(usageLogs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch usage logs' });
  }
});

// Create usage log
router.post('/', async (req: Request, res: Response) => {
  try {
    const { coffeeId, amountUsed, usageDate, notes } = req.body;

    const usageLog = await prisma.usageLog.create({
      data: {
        coffeeId: parseInt(coffeeId),
        amountUsed: parseFloat(amountUsed),
        usageDate: usageDate ? new Date(usageDate) : new Date(),
        notes,
      },
      include: {
        coffee: true,
      },
    });

    res.status(201).json(usageLog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create usage log' });
  }
});

// Delete usage log
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.usageLog.delete({
      where: { id: parseInt(id) },
    });
    res.json({ message: 'Usage log deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete usage log' });
  }
});

export default router;
