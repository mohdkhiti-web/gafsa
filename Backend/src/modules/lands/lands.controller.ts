import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request as Req, HttpCode, HttpStatus } from '@nestjs/common';
import { LandsService } from './lands.service';
import { CreateLandDto } from './dto/create-land.dto';
import { UpdateLandDto } from './dto/update-land.dto';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth,
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
class LandResponseDto {
  id: number;
  name: string;
  location: string;
  size: number;
  status: string;
  price: number;
  description?: string;
  type?: string;
  coordinates?: string;
  imageUrl?: string;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
}

class CreateLandRequestDto {
  name: string;
  location: string;
  size: number;
  status: string;
  price: number;
  description?: string;
  type?: string;
  coordinates?: string;
  imageUrl?: string;
}

class UpdateLandRequestDto {
  name?: string;
  location?: string;
  size?: number;
  status?: string;
  price?: number;
  description?: string;
  type?: string;
  coordinates?: string;
  imageUrl?: string;
}

@ApiTags('lands')
@Controller('lands')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class LandsController {
  constructor(private readonly landsService: LandsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ 
    summary: 'Create new land',
    description: 'Register a new piece of agricultural land'
  })
  @ApiBody({ 
    type: CreateLandRequestDto,
    description: 'Land registration data'
  })
  @ApiCreatedResponse({ 
    description: 'Land successfully created',
    type: LandResponseDto
  })
  @ApiBadRequestResponse({ 
    description: 'Invalid input data' 
  })
  @ApiUnauthorizedResponse({ 
    description: 'Invalid or missing authentication token' 
  })
  async create(@Body() createLandDto: CreateLandDto, @Req() req): Promise<LandResponseDto> {
    return this.landsService.create({
      ...createLandDto,
      userId: req.user.id,
    });
  }

  @Get()
  @ApiOperation({ 
    summary: 'Get all lands',
    description: 'Retrieve a list of all registered lands in the system'
  })
  @ApiOkResponse({ 
    description: 'List of all lands retrieved successfully',
    type: [LandResponseDto]
  })
  @ApiUnauthorizedResponse({ 
    description: 'Invalid or missing authentication token' 
  })
  async findAll(): Promise<LandResponseDto[]> {
    return this.landsService.findAll();
  }

  @Get('my-lands')
  @ApiOperation({ 
    summary: 'Get user lands',
    description: 'Retrieve all lands owned by the authenticated user'
  })
  @ApiOkResponse({ 
    description: 'User lands retrieved successfully',
    type: [LandResponseDto]
  })
  @ApiUnauthorizedResponse({ 
    description: 'Invalid or missing authentication token' 
  })
  async findMyLands(@Req() req): Promise<LandResponseDto[]> {
    return this.landsService.findByUserId(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Get land by ID',
    description: 'Retrieve a specific piece of land by its ID'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Land ID',
    type: 'number'
  })
  @ApiOkResponse({ 
    description: 'Land retrieved successfully',
    type: LandResponseDto
  })
  @ApiNotFoundResponse({ 
    description: 'Land not found' 
  })
  @ApiUnauthorizedResponse({ 
    description: 'Invalid or missing authentication token' 
  })
  async findOne(@Param('id') id: string): Promise<LandResponseDto> {
    return this.landsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ 
    summary: 'Update land',
    description: 'Update an existing piece of land\'s information'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Land ID',
    type: 'number'
  })
  @ApiBody({ 
    type: UpdateLandRequestDto,
    description: 'Land update data'
  })
  @ApiOkResponse({ 
    description: 'Land successfully updated',
    type: LandResponseDto
  })
  @ApiBadRequestResponse({ 
    description: 'Invalid input data' 
  })
  @ApiNotFoundResponse({ 
    description: 'Land not found' 
  })
  @ApiUnauthorizedResponse({ 
    description: 'Invalid or missing authentication token' 
  })
  async update(@Param('id') id: string, @Body() updateLandDto: UpdateLandDto): Promise<LandResponseDto> {
    return this.landsService.update(+id, updateLandDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Delete land',
    description: 'Permanently remove a piece of land from the system'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Land ID',
    type: 'number'
  })
  @ApiOkResponse({ 
    description: 'Land successfully deleted',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Land deleted successfully'
        }
      }
    }
  })
  @ApiNotFoundResponse({ 
    description: 'Land not found' 
  })
  @ApiUnauthorizedResponse({ 
    description: 'Invalid or missing authentication token' 
  })
  async remove(@Param('id') id: string) {
    await this.landsService.remove(+id);
    return { message: 'Land deleted successfully' };
  }
} 