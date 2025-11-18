import { Router, Request, Response } from 'express';
import { prisma } from '../server';

const router = Router();

// Get all recipes
router.get('/', async (req: Request, res: Response) => {
  try {
    const recipes = await prisma.recipe.findMany({
      orderBy: { name: 'asc' },
      include: {
        machine: true,
        machineUsageLogs: true,
      },
    });
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch recipes' });
  }
});

// Get single recipe
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const recipe = await prisma.recipe.findUnique({
      where: { id: parseInt(id) },
      include: {
        machine: true,
        machineUsageLogs: {
          orderBy: { usageDate: 'desc' },
        },
      },
    });

    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    res.json(recipe);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch recipe' });
  }
});

// Get recipes for specific machine
router.get('/machine/:machineId', async (req: Request, res: Response) => {
  try {
    const { machineId } = req.params;
    const recipes = await prisma.recipe.findMany({
      where: { machineId: parseInt(machineId) },
      orderBy: { name: 'asc' },
      include: {
        machineUsageLogs: true,
      },
    });
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch recipes' });
  }
});

// Create new recipe
router.post('/', async (req: Request, res: Response) => {
  try {
    const { machineId, name, volumeMl, description, isActive } = req.body;

    const recipe = await prisma.recipe.create({
      data: {
        machineId: parseInt(machineId),
        name,
        volumeMl: parseFloat(volumeMl),
        description,
        isActive: isActive !== undefined ? isActive : true,
      },
      include: {
        machine: true,
      },
    });

    res.status(201).json(recipe);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create recipe' });
  }
});

// Update recipe
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, volumeMl, description, isActive } = req.body;

    const recipe = await prisma.recipe.update({
      where: { id: parseInt(id) },
      data: {
        name,
        volumeMl: volumeMl ? parseFloat(volumeMl) : undefined,
        description,
        isActive,
      },
      include: {
        machine: true,
      },
    });

    res.json(recipe);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update recipe' });
  }
});

// Delete recipe
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.recipe.delete({
      where: { id: parseInt(id) },
    });
    res.json({ message: 'Recipe deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete recipe' });
  }
});

export default router;
