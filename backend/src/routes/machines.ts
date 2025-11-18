import { Router, Request, Response } from 'express';
import { prisma } from '../server';

const router = Router();

// Get all machines
router.get('/', async (req: Request, res: Response) => {
  try {
    const machines = await prisma.coffeeMachine.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        recipes: true,
        machineUsageLogs: true,
      },
    });
    res.json(machines);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch machines' });
  }
});

// Get single machine
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const machine = await prisma.coffeeMachine.findUnique({
      where: { id: parseInt(id) },
      include: {
        recipes: {
          orderBy: { name: 'asc' },
        },
        machineUsageLogs: {
          orderBy: { usageDate: 'desc' },
          take: 50,
        },
      },
    });

    if (!machine) {
      return res.status(404).json({ error: 'Machine not found' });
    }

    res.json(machine);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch machine' });
  }
});

// Create new machine
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, brand, model, notes } = req.body;

    const machine = await prisma.coffeeMachine.create({
      data: {
        name,
        brand,
        model,
        notes,
      },
    });

    res.status(201).json(machine);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create machine' });
  }
});

// Update machine
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, brand, model, notes } = req.body;

    const machine = await prisma.coffeeMachine.update({
      where: { id: parseInt(id) },
      data: {
        name,
        brand,
        model,
        notes,
      },
    });

    res.json(machine);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update machine' });
  }
});

// Delete machine
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.coffeeMachine.delete({
      where: { id: parseInt(id) },
    });
    res.json({ message: 'Machine deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete machine' });
  }
});

export default router;
