import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Create land
router.post('/', async (req, res) => {
  try {
    const { name, size, location, status, price, description, userId } = req.body;
    const land = await prisma.land.create({
      data: {
        name,
        size,
        location,
        status,
        price,
        description,
        userId,
      },
    });
    res.json(land);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create land' });
  }
});

// Get all lands
router.get('/', async (req, res) => {
  try {
    const lands = await prisma.land.findMany({
      include: {
        user: true,
      },
    });
    res.json(lands);
  } catch (error) {
    res.status(400).json({ error: 'Failed to fetch lands' });
  }
});

// Get land by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const land = await prisma.land.findUnique({
      where: { id: parseInt(id) },
      include: {
        user: true,
      },
    });
    if (!land) {
      return res.status(404).json({ error: 'Land not found' });
    }
    res.json(land);
  } catch (error) {
    res.status(400).json({ error: 'Failed to fetch land' });
  }
});

// Update land
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, size, location, status, price, description, userId } = req.body;
    const land = await prisma.land.update({
      where: { id: parseInt(id) },
      data: {
        name,
        size,
        location,
        status,
        price,
        description,
        userId,
      },
    });
    res.json(land);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update land' });
  }
});

// Delete land
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.land.delete({
      where: { id: parseInt(id) },
    });
    res.json({ message: 'Land deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete land' });
  }
});

export default router; 