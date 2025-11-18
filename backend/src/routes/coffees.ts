import { Router, Request, Response } from 'express';
import { prisma } from '../server';
import { RoastLevel } from '@prisma/client';

const router = Router();

// Get all coffees
router.get('/', async (req: Request, res: Response) => {
  try {
    const coffees = await prisma.coffee.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        usageLogs: true,
      },
    });
    res.json(coffees);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch coffees' });
  }
});

// Get single coffee
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const coffee = await prisma.coffee.findUnique({
      where: { id: parseInt(id) },
      include: {
        usageLogs: {
          orderBy: { usageDate: 'desc' },
        },
      },
    });

    if (!coffee) {
      return res.status(404).json({ error: 'Coffee not found' });
    }

    res.json(coffee);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch coffee' });
  }
});

// Create new coffee
router.post('/', async (req: Request, res: Response) => {
  try {
    const {
      name,
      brand,
      roastLevel,
      origin,
      shopName,
      purchaseDate,
      initialQuantity,
      currentQuantity,
      pricePerBag,
      notes,
    } = req.body;

    const coffee = await prisma.coffee.create({
      data: {
        name,
        brand,
        roastLevel: roastLevel as RoastLevel,
        origin,
        shopName,
        purchaseDate: new Date(purchaseDate),
        initialQuantity: parseFloat(initialQuantity),
        currentQuantity: parseFloat(currentQuantity),
        pricePerBag: parseFloat(pricePerBag),
        notes,
      },
    });

    res.status(201).json(coffee);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create coffee' });
  }
});

// Update coffee
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      name,
      brand,
      roastLevel,
      origin,
      shopName,
      purchaseDate,
      initialQuantity,
      currentQuantity,
      pricePerBag,
      notes,
    } = req.body;

    const coffee = await prisma.coffee.update({
      where: { id: parseInt(id) },
      data: {
        name,
        brand,
        roastLevel: roastLevel as RoastLevel,
        origin,
        shopName,
        purchaseDate: purchaseDate ? new Date(purchaseDate) : undefined,
        initialQuantity: initialQuantity ? parseFloat(initialQuantity) : undefined,
        currentQuantity: currentQuantity ? parseFloat(currentQuantity) : undefined,
        pricePerBag: pricePerBag ? parseFloat(pricePerBag) : undefined,
        notes,
      },
    });

    res.json(coffee);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update coffee' });
  }
});

// Delete coffee
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.coffee.delete({
      where: { id: parseInt(id) },
    });
    res.json({ message: 'Coffee deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete coffee' });
  }
});

export default router;
