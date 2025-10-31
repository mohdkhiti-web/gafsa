import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Create order
router.post('/', async (req, res) => {
  try {
    const { status, totalAmount, userId, orderItems } = req.body;
    const order = await prisma.order.create({
      data: {
        status,
        totalAmount,
        userId,
        orderItems: {
          create: orderItems,
        },
      },
      include: {
        orderItems: {
          include: {
            equipment: true,
          },
        },
        user: true,
      },
    });
    res.json(order);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create order' });
  }
});

// Get all orders
router.get('/', async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        orderItems: {
          include: {
            equipment: true,
          },
        },
        user: true,
      },
    });
    res.json(orders);
  } catch (error) {
    res.status(400).json({ error: 'Failed to fetch orders' });
  }
});

// Get order by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const order = await prisma.order.findUnique({
      where: { id: parseInt(id) },
      include: {
        orderItems: {
          include: {
            equipment: true,
          },
        },
        user: true,
      },
    });
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(400).json({ error: 'Failed to fetch order' });
  }
});

// Update order
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, totalAmount, userId } = req.body;
    const order = await prisma.order.update({
      where: { id: parseInt(id) },
      data: {
        status,
        totalAmount,
        userId,
      },
      include: {
        orderItems: {
          include: {
            equipment: true,
          },
        },
        user: true,
      },
    });
    res.json(order);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update order' });
  }
});

// Delete order
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.order.delete({
      where: { id: parseInt(id) },
    });
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete order' });
  }
});

export default router; 