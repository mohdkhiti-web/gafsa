import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateEquipmentDto } from './dto/create-equipment.dto';
import { UpdateEquipmentDto } from './dto/update-equipment.dto';

@Injectable()
export class EquipmentService {
  constructor(private prisma: PrismaService) {}

  async create(createEquipmentDto: CreateEquipmentDto) {
    return this.prisma.equipment.create({
      data: createEquipmentDto,
      include: {
        orderItems: true,
      },
    });
  }

  async findAll() {
    return this.prisma.equipment.findMany({
      include: {
        orderItems: true,
      },
    });
  }

  async findOne(id: number) {
    const equipment = await this.prisma.equipment.findUnique({
      where: { id },
      include: {
        orderItems: true,
      },
    });
    if (!equipment) {
      throw new NotFoundException(`Equipment with ID ${id} not found`);
    }
    return equipment;
  }

  async update(id: number, updateEquipmentDto: UpdateEquipmentDto) {
    const equipment = await this.prisma.equipment.findUnique({
      where: { id },
    });
    if (!equipment) {
      throw new NotFoundException(`Equipment with ID ${id} not found`);
    }

    return this.prisma.equipment.update({
      where: { id },
      data: updateEquipmentDto,
      include: {
        orderItems: true,
      },
    });
  }

  async remove(id: number) {
    const equipment = await this.prisma.equipment.findUnique({
      where: { id },
    });
    if (!equipment) {
      throw new NotFoundException(`Equipment with ID ${id} not found`);
    }

    await this.prisma.equipment.delete({
      where: { id },
    });
    return { message: 'Equipment deleted successfully' };
  }

  async findByType(type: string) {
    return this.prisma.equipment.findMany({
      where: { type },
      include: {
        orderItems: true,
      },
    });
  }

  async findByStatus(status: string) {
    return this.prisma.equipment.findMany({
      where: { status },
    });
  }
} 