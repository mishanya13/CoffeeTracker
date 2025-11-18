import { Router, Request, Response } from 'express';
import { prisma } from '../server';

const router = Router();

// Get overall statistics
router.get('/', async (req: Request, res: Response) => {
  try {
    // Coffee stats
    const totalCoffees = await prisma.coffee.count();
    const totalCoffeeWeight = await prisma.coffee.aggregate({
      _sum: { currentQuantity: true },
    });
    const totalCoffeeUsage = await prisma.usageLog.aggregate({
      _sum: { amountUsed: true },
    });

    // Machine stats
    const totalMachines = await prisma.coffeeMachine.count();
    const totalRecipes = await prisma.recipe.count();
    const totalMachineUsage = await prisma.machineUsageLog.count();
    const totalVolumeConsumed = await prisma.machineUsageLog.aggregate({
      _sum: { volumeMl: true },
    });

    res.json({
      coffee: {
        totalCoffees,
        totalCurrentWeight: totalCoffeeWeight._sum.currentQuantity || 0,
        totalUsageWeight: totalCoffeeUsage._sum.amountUsed || 0,
      },
      machine: {
        totalMachines,
        totalRecipes,
        totalDrinksPrepared: totalMachineUsage,
        totalVolumeConsumed: totalVolumeConsumed._sum.volumeMl || 0,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// Get machine statistics
router.get('/machine/:machineId', async (req: Request, res: Response) => {
  try {
    const { machineId } = req.params;
    const id = parseInt(machineId);

    const machine = await prisma.coffeeMachine.findUnique({
      where: { id },
      include: {
        recipes: true,
      },
    });

    if (!machine) {
      return res.status(404).json({ error: 'Machine not found' });
    }

    const totalUsage = await prisma.machineUsageLog.count({
      where: { machineId: id },
    });

    const totalVolume = await prisma.machineUsageLog.aggregate({
      where: { machineId: id },
      _sum: { volumeMl: true },
    });

    // Recipe usage stats
    const recipeStats = await Promise.all(
      machine.recipes.map(async (recipe) => {
        const count = await prisma.machineUsageLog.count({
          where: { recipeId: recipe.id },
        });
        const volume = await prisma.machineUsageLog.aggregate({
          where: { recipeId: recipe.id },
          _sum: { volumeMl: true },
        });
        return {
          recipeId: recipe.id,
          recipeName: recipe.name,
          count,
          totalVolume: volume._sum.volumeMl || 0,
        };
      })
    );

    // Sort by count descending
    recipeStats.sort((a, b) => b.count - a.count);

    res.json({
      machine,
      totalDrinksPrepared: totalUsage,
      totalVolumeConsumed: totalVolume._sum.volumeMl || 0,
      recipeStats,
      mostPopular: recipeStats[0] || null,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch machine statistics' });
  }
});

// Get recipe statistics
router.get('/recipe/:recipeId', async (req: Request, res: Response) => {
  try {
    const { recipeId } = req.params;
    const id = parseInt(recipeId);

    const recipe = await prisma.recipe.findUnique({
      where: { id },
      include: {
        machine: true,
      },
    });

    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    const totalCount = await prisma.machineUsageLog.count({
      where: { recipeId: id },
    });

    const totalVolume = await prisma.machineUsageLog.aggregate({
      where: { recipeId: id },
      _sum: { volumeMl: true },
    });

    const recentUsage = await prisma.machineUsageLog.findMany({
      where: { recipeId: id },
      orderBy: { usageDate: 'desc' },
      take: 10,
    });

    res.json({
      recipe,
      totalCount,
      totalVolume: totalVolume._sum.volumeMl || 0,
      averageVolume: totalCount > 0 ? (totalVolume._sum.volumeMl || 0) / totalCount : 0,
      recentUsage,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch recipe statistics' });
  }
});

export default router;
