import { Module } from '@nestjs/common';
import { LandsService } from './lands.service';
import { LandsController } from './lands.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  providers: [LandsService, PrismaService],
  controllers: [LandsController],
  exports: [LandsService],
})
export class LandsModule {} 