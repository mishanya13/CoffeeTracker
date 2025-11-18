import { Router, Request, Response } from 'express';
import { prisma } from '../server';

const router = Router();

// Get all machine usage logs
router.get('/', async (req: Request, res: Response) => {
  try {
    const usageLogs = await prisma.machineUsageLog.findMany({
      orderBy: { usageDate: 'desc' },
      include: {
        recipe: true,
        machine: true,
      },
    });
    res.json(usageLogs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch machine usage logs' });
  }
});

// Get usage logs for specific recipe
router.get('/recipe/:recipeId', async (req: Request, res: Response) => {
  try {
    const { recipeId } = req.params;
    const usageLogs = await prisma.machineUsageLog.findMany({
      where: { recipeId: parseInt(recipeId) },
      orderBy: { usageDate: 'desc' },
      include: {
        recipe: true,
        machine: true,
      },
    });
    res.json(usageLogs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch usage logs' });
  }
});

// Get usage logs for specific machine
router.get('/machine/:machineId', async (req: Request, res: Response) => {
  try {
    const { machineId } = req.params;
    const usageLogs = await prisma.machineUsageLog.findMany({
      where: { machineId: parseInt(machineId) },
      orderBy: { usageDate: 'desc' },
      include: {
        recipe: true,
        machine: true,
      },
    });
    res.json(usageLogs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch usage logs' });
  }
});

// Create machine usage log
router.post('/', async (req: Request, res: Response) => {
  try {
    const { recipeId, machineId, volumeMl, usageDate, notes } = req.body;

    const usageLog = await prisma.machineUsageLog.create({
      data: {
        recipeId: parseInt(recipeId),
        machineId: parseInt(machineId),
        volumeMl: parseFloat(volumeMl),
        usageDate: usageDate ? new Date(usageDate) : new Date(),
        notes,
      },
      include: {
        recipe: true,
        machine: true,
      },
    });

    res.status(201).json(usageLog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create machine usage log' });
  }
});

// Delete machine usage log
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.machineUsageLog.delete({
      where: { id: parseInt(id) },
    });
    res.json({ message: 'Machine usage log deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete usage log' });
  }
});

export default router;
