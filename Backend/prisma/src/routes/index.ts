import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Invest Farm API',
      version: '1.0.0',
      description: 'API documentation for Invest Farm application',
    },
    servers: [
      {
        url: 'http://localhost:3001/api-docs',
        description: 'Development server',
      },
    ],
  },
  apis: ['./src/routes/*.ts'],
};



/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - email
 *         - name
 *         - password
 *       properties:
 *         id:
 *           type: integer
 *         email:
 *           type: string
 *         name:
 *           type: string
 *         password:
 *           type: string
 *         role:
 *           type: string
 *         phone:
 *           type: string
 *         address:
 *           type: string
 *     Land:
 *       type: object
 *       required:
 *         - name
 *         - size
 *         - location
 *         - price
 *         - userId
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         size:
 *           type: number
 *         location:
 *           type: string
 *         status:
 *           type: string
 *         price:
 *           type: number
 *         description:
 *           type: string
 *         userId:
 *           type: integer
 *     Equipment:
 *       type: object
 *       required:
 *         - name
 *         - type
 *         - price
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         type:
 *           type: string
 *         status:
 *           type: string
 *         price:
 *           type: number
 *         description:
 *           type: string
 *     Order:
 *       type: object
 *       required:
 *         - status
 *         - totalAmount
 *         - userId
 *       properties:
 *         id:
 *           type: integer
 *         status:
 *           type: string
 *         totalAmount:
 *           type: number
 *         userId:
 *           type: integer
 *         orderItems:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OrderItem'
 *     OrderItem:
 *       type: object
 *       required:
 *         - quantity
 *         - price
 *         - orderId
 *         - equipmentId
 *       properties:
 *         id:
 *           type: integer
 *         quantity:
 *           type: integer
 *         price:
 *           type: number
 *         orderId:
 *           type: integer
 *         equipmentId:
 *           type: integer
 */

// User Routes
/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: User created successfully
 */
router.post('/users', async (req, res) => {
  try {
    const { email, name, password, role, phone, address } = req.body;
    const user = await prisma.user.create({
      data: { email, name, password, role, phone, address },
    });
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create user' });
  }
});

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
router.get('/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: { lands: true, orders: true },
    });
    res.json(users);
  } catch (error) {
    res.status(400).json({ error: 'Failed to fetch users' });
  }
});

// Land Routes
/**
 * @swagger
 * /api/lands:
 *   post:
 *     summary: Create a new land
 *     tags: [Lands]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Land'
 *     responses:
 *       200:
 *         description: Land created successfully
 */
router.post('/lands', async (req, res) => {
  try {
    const { name, size, location, status, price, description, userId } = req.body;
    const land = await prisma.land.create({
      data: { name, size, location, status, price, description, userId },
    });
    res.json(land);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create land' });
  }
});

/**
 * @swagger
 * /api/lands:
 *   get:
 *     summary: Get all lands
 *     tags: [Lands]
 *     responses:
 *       200:
 *         description: List of lands
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Land'
 */
router.get('/lands', async (req, res) => {
  try {
    const lands = await prisma.land.findMany({
      include: { user: true },
    });
    res.json(lands);
  } catch (error) {
    res.status(400).json({ error: 'Failed to fetch lands' });
  }
});

// Equipment Routes
/**
 * @swagger
 * /api/equipment:
 *   post:
 *     summary: Create new equipment
 *     tags: [Equipment]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Equipment'
 *     responses:
 *       200:
 *         description: Equipment created successfully
 */
router.post('/equipment', async (req, res) => {
  try {
    const { name, type, status, price, description } = req.body;
    const equipment = await prisma.equipment.create({
      data: { name, type, status, price, description },
    });
    res.json(equipment);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create equipment' });
  }
});

/**
 * @swagger
 * /api/equipment:
 *   get:
 *     summary: Get all equipment
 *     tags: [Equipment]
 *     responses:
 *       200:
 *         description: List of equipment
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Equipment'
 */
router.get('/equipment', async (req, res) => {
  try {
    const equipment = await prisma.equipment.findMany({
      include: { orderItems: true },
    });
    res.json(equipment);
  } catch (error) {
    res.status(400).json({ error: 'Failed to fetch equipment' });
  }
});

// Order Routes
/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Order'
 *     responses:
 *       200:
 *         description: Order created successfully
 */
router.post('/orders', async (req, res) => {
  try {
    const { status, totalAmount, userId, orderItems } = req.body;
    const order = await prisma.order.create({
      data: {
        status,
        totalAmount,
        userId,
        orderItems: { create: orderItems },
      },
      include: {
        orderItems: { include: { equipment: true } },
        user: true,
      },
    });
    res.json(order);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create order' });
  }
});

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get all orders
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: List of orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 */
router.get('/orders', async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        orderItems: { include: { equipment: true } },
        user: true,
      },
    });
    res.json(orders);
  } catch (error) {
    res.status(400).json({ error: 'Failed to fetch orders' });
  }
});

// Add more CRUD operations for each model as needed...

export default router; 