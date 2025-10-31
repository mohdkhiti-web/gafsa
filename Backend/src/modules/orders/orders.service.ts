import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(createOrderDto: CreateOrderDto) {
    return this.prisma.order.create({
      data: {
        status: createOrderDto.status,
        totalAmount: createOrderDto.totalAmount,
        userId: createOrderDto.userId,
        orderItems: {
          create: createOrderDto.orderItems,
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
  }

  async findAll() {
    return this.prisma.order.findMany({
      include: {
        orderItems: {
          include: {
            equipment: true,
          },
        },
        user: true,
      },
    });
  }

  async findOne(id: number) {
    const order = await this.prisma.order.findUnique({
      where: { id },
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
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    const order = await this.prisma.order.findUnique({
      where: { id },
    });
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    const { orderItems, ...orderData } = updateOrderDto;

    const updatedOrder = await this.prisma.order.update({
      where: { id },
      data: {
        ...orderData,
        ...(orderItems && {
          orderItems: {
            deleteMany: {},
            create: orderItems,
          },
        }),
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

    return updatedOrder;
  }

  async remove(id: number) {
    const order = await this.prisma.order.findUnique({
      where: { id },
    });
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    await this.prisma.order.delete({
      where: { id },
    });
    return { message: 'Order deleted successfully' };
  }

  async findByUserId(userId: number) {
    return this.prisma.order.findMany({
      where: { userId },
      include: {
        orderItems: {
          include: {
            equipment: true,
          },
        },
        user: true,
      },
    });
  }

  async findByStatus(status: string) {
    return this.prisma.order.findMany({
      where: { status },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        orderItems: {
          include: {
            equipment: true,
          },
        },
      },
    });
  }
} 