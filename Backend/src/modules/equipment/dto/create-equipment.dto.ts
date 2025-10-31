import { IsString, IsNumber, IsOptional, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEquipmentDto {
  @ApiProperty({ example: 'John Deere Tractor' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'TRACTOR' })
  @IsString()
  type: string;

  @ApiProperty({ example: 'AVAILABLE' })
  @IsString()
  status: string;

  @ApiProperty({ example: 45000 })
  @IsNumber()
  price: number;

  @ApiProperty({ example: 'High-performance agricultural tractor' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 'https://example.com/tractor.jpg', required: false })
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @ApiProperty({ 
    example: '{"horsepower": 150, "fuelType": "diesel"}',
    required: false
  })
  @IsString()
  @IsOptional()
  specifications?: string;
} 