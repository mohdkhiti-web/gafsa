import { Module } from '@nestjs/common';
import { EquipmentService } from './equipment.service';
import { EquipmentController } from './equipment.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  providers: [EquipmentService, PrismaService],
  controllers: [EquipmentController],
  exports: [EquipmentService],
})
export class EquipmentModule {} 