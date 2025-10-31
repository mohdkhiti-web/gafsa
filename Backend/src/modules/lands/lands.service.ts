import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateLandDto } from './dto/create-land.dto';
import { UpdateLandDto } from './dto/update-land.dto';

@Injectable()
export class LandsService {
  constructor(private prisma: PrismaService) {}

  async create(createLandDto: CreateLandDto) {
    const { userId, ...landData } = createLandDto;
    return this.prisma.land.create({
      data: {
        ...landData,
        user: {
          connect: { id: userId }
        }
      },
      include: {
        user: true,
      },
    });
  }

  async findAll() {
    return this.prisma.land.findMany({
      include: {
        user: true,
      },
    });
  }

  async findOne(id: number) {
    const land = await this.prisma.land.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });
    if (!land) {
      throw new NotFoundException(`Land with ID ${id} not found`);
    }
    return land;
  }

  async update(id: number, updateLandDto: UpdateLandDto) {
    const land = await this.prisma.land.findUnique({
      where: { id },
    });
    if (!land) {
      throw new NotFoundException(`Land with ID ${id} not found`);
    }

    return this.prisma.land.update({
      where: { id },
      data: updateLandDto,
      include: {
        user: true,
      },
    });
  }

  async remove(id: number) {
    const land = await this.prisma.land.findUnique({
      where: { id },
    });
    if (!land) {
      throw new NotFoundException(`Land with ID ${id} not found`);
    }

    await this.prisma.land.delete({
      where: { id },
    });
    return { message: 'Land deleted successfully' };
  }

  async findByUserId(userId: number) {
    return this.prisma.land.findMany({
      where: { userId },
      include: {
        user: true,
      },
    });
  }

  async findByStatus(status: string) {
    return this.prisma.land.findMany({
      where: { status },
      include: {
        user: true,
      },
    });
  }
} 