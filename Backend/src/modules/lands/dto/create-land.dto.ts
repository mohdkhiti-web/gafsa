import { IsString, IsNumber, IsOptional, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLandDto {
  @ApiProperty({ example: 'Sunset Farm' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Rural County, State' })
  @IsString()
  location: string;

  @ApiProperty({ example: 150.5 })
  @IsNumber()
  size: number;

  @ApiProperty({ example: 'AVAILABLE' })
  @IsString()
  status: string;

  @ApiProperty({ example: 50000 })
  @IsNumber()
  price: number;

  @ApiProperty({ example: 'Prime agricultural land with good irrigation' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 'AGRICULTURAL', required: false })
  @IsString()
  @IsOptional()
  type?: string;

  @ApiProperty({ 
    example: '{"latitude": 40.7128, "longitude": -74.0060}',
    required: false
  })
  @IsString()
  @IsOptional()
  coordinates?: string;

  @ApiProperty({ example: 'https://example.com/land.jpg', required: false })
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  userId: number;
} 