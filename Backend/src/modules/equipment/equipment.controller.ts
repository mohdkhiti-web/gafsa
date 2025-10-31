import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { EquipmentService } from './equipment.service';
import { CreateEquipmentDto } from './dto/create-equipment.dto';
import { UpdateEquipmentDto } from './dto/update-equipment.dto';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth, 
  ApiQuery,
  ApiParam,
  ApiBody,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

// DTOs for Swagger documentation
class EquipmentResponseDto {
  id: number;
  name: string;
  type: string;
  description?: string;
  price: number;
  status: string;
  imageUrl?: string;
  specifications?: string;
  createdAt: Date;
  updatedAt: Date;
}

class CreateEquipmentRequestDto {
  name: string;
  type: string;
  description?: string;
  price: number;
  status: string;
  imageUrl?: string;
  specifications?: string;
}

class UpdateEquipmentRequestDto {
  name?: string;
  type?: string;
  description?: string;
  price?: number;
  status?: string;
  imageUrl?: string;
  specifications?: string;
}

@ApiTags('equipment')
@Controller('equipment')
export class EquipmentController {
  constructor(private readonly equipmentService: EquipmentService) {}

  @Get()
  @ApiOperation({ 
    summary: 'Get all equipment',
    description: 'Retrieve all agricultural equipment available for rent/purchase'
  })
  @ApiQuery({ 
    name: 'type', 
    required: false, 
    description: 'Filter equipment by type (TRACTOR, HARVESTER, etc.)' 
  })
  @ApiOkResponse({ 
    description: 'Equipment list retrieved successfully',
    type: [EquipmentResponseDto]
  })
  async findAll(@Query('type') type?: string): Promise<EquipmentResponseDto[]> {
    if (type) {
      return this.equipmentService.findByType(type);
    }
    return this.equipmentService.findAll();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ 
    summary: 'Create new equipment',
    description: 'Add a new piece of agricultural equipment to the inventory'
  })
  @ApiBody({ 
    type: CreateEquipmentRequestDto,
    description: 'Equipment creation data'
  })
  @ApiCreatedResponse({ 
    description: 'Equipment successfully created',
    type: EquipmentResponseDto
  })
  @ApiBadRequestResponse({ 
    description: 'Invalid input data' 
  })
  @ApiUnauthorizedResponse({ 
    description: 'Invalid or missing authentication token' 
  })
  async create(@Body() createEquipmentDto: CreateEquipmentDto): Promise<EquipmentResponseDto> {
    return this.equipmentService.create(createEquipmentDto);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Get equipment by ID',
    description: 'Retrieve a specific piece of equipment by its ID'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Equipment ID',
    type: 'number'
  })
  @ApiOkResponse({ 
    description: 'Equipment retrieved successfully',
    type: EquipmentResponseDto
  })
  @ApiNotFoundResponse({ 
    description: 'Equipment not found' 
  })
  @ApiUnauthorizedResponse({ 
    description: 'Invalid or missing authentication token' 
  })
  async findOne(@Param('id') id: string): Promise<EquipmentResponseDto> {
    return this.equipmentService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Update equipment',
    description: 'Update an existing piece of equipment\'s information'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Equipment ID',
    type: 'number'
  })
  @ApiBody({ 
    type: UpdateEquipmentRequestDto,
    description: 'Equipment update data'
  })
  @ApiOkResponse({ 
    description: 'Equipment successfully updated',
    type: EquipmentResponseDto
  })
  @ApiBadRequestResponse({ 
    description: 'Invalid input data' 
  })
  @ApiNotFoundResponse({ 
    description: 'Equipment not found' 
  })
  @ApiUnauthorizedResponse({ 
    description: 'Invalid or missing authentication token' 
  })
  async update(@Param('id') id: string, @Body() updateEquipmentDto: UpdateEquipmentDto): Promise<EquipmentResponseDto> {
    return this.equipmentService.update(+id, updateEquipmentDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Delete equipment',
    description: 'Permanently remove a piece of equipment from the inventory'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Equipment ID',
    type: 'number'
  })
  @ApiOkResponse({ 
    description: 'Equipment successfully deleted',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Equipment deleted successfully'
        }
      }
    }
  })
  @ApiNotFoundResponse({ 
    description: 'Equipment not found' 
  })
  @ApiUnauthorizedResponse({ 
    description: 'Invalid or missing authentication token' 
  })
  async remove(@Param('id') id: string) {
    await this.equipmentService.remove(+id);
    return { message: 'Equipment deleted successfully' };
  }
} 