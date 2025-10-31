import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Create equipment
router.post('/', async (req, res) => {
  try {
    const { name, type, status, price, description } = req.body;
    const equipment = await prisma.equipment.create({
      data: {
        name,
        type,
        status,
        price,
        description,
      },
    });
    res.json(equipment);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create equipment' });
  }
});

// Get all equipment
router.get('/', async (req, res) => {
  try {
    const equipment = await prisma.equipment.findMany({
      include: {
        orderItems: true,
      },
    });
    res.json(equipment);
  } catch (error) {
    res.status(400).json({ error: 'Failed to fetch equipment' });
  }
});

// Get equipment by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const equipment = await prisma.equipment.findUnique({
      where: { id: parseInt(id) },
      include: {
        orderItems: true,
      },
    });
    if (!equipment) {
      return res.status(404).json({ error: 'Equipment not found' });
    }
    res.json(equipment);
  } catch (error) {
    res.status(400).json({ error: 'Failed to fetch equipment' });
  }
});

// Update equipment
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type, status, price, description } = req.body;
    const equipment = await prisma.equipment.update({
      where: { id: parseInt(id) },
      data: {
        name,
        type,
        status,
        price,
        description,
      },
    });
    res.json(equipment);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update equipment' });
  }
});

// Delete equipment
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.equipment.delete({
      where: { id: parseInt(id) },
    });
    res.json({ message: 'Equipment deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete equipment' });
  }
});

export default router; 