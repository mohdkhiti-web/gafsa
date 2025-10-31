import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
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
class UserResponseDto {
  id: number;
  email: string;
  name: string;
  role: string;
  phone?: string;
  address?: string;
  createdAt: Date;
  updatedAt: Date;
}

class CreateUserRequestDto {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role?: string;
  address?: string;
}

class UpdateUserRequestDto {
  name?: string;
  email?: string;
  phone?: string;
  role?: string;
  address?: string;
}

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ 
    summary: 'Create new user',
    description: 'Create a new user account with the provided information'
  })
  @ApiBody({ 
    type: CreateUserRequestDto,
    description: 'User creation data'
  })
  @ApiCreatedResponse({ 
    description: 'User successfully created',
    type: UserResponseDto
  })
  @ApiBadRequestResponse({ 
    description: 'Invalid input data or user already exists' 
  })
  @ApiUnauthorizedResponse({ 
    description: 'Invalid or missing authentication token' 
  })
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const user = await this.usersService.create(createUserDto);
    return user as UserResponseDto;
  }

  @Get()
  @ApiOperation({ 
    summary: 'Get all users',
    description: 'Retrieve a list of all users in the system'
  })
  @ApiOkResponse({ 
    description: 'List of all users retrieved successfully',
    type: [UserResponseDto]
  })
  @ApiUnauthorizedResponse({ 
    description: 'Invalid or missing authentication token' 
  })
  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.usersService.findAll();
    return users as UserResponseDto[];
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Get user by ID',
    description: 'Retrieve a specific user by their ID'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'User ID',
    type: 'number'
  })
  @ApiOkResponse({ 
    description: 'User retrieved successfully',
    type: UserResponseDto
  })
  @ApiNotFoundResponse({ 
    description: 'User not found' 
  })
  @ApiUnauthorizedResponse({ 
    description: 'Invalid or missing authentication token' 
  })
  async findOne(@Param('id') id: string): Promise<UserResponseDto> {
    const user = await this.usersService.findOne(+id);
    return user as UserResponseDto;
  }

  @Patch(':id')
  @ApiOperation({ 
    summary: 'Update user',
    description: 'Update an existing user\'s information'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'User ID',
    type: 'number'
  })
  @ApiBody({ 
    type: UpdateUserRequestDto,
    description: 'User update data'
  })
  @ApiOkResponse({ 
    description: 'User successfully updated',
    type: UserResponseDto
  })
  @ApiBadRequestResponse({ 
    description: 'Invalid input data' 
  })
  @ApiNotFoundResponse({ 
    description: 'User not found' 
  })
  @ApiUnauthorizedResponse({ 
    description: 'Invalid or missing authentication token' 
  })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
    const user = await this.usersService.update(+id, updateUserDto);
    return user as UserResponseDto;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Delete user',
    description: 'Permanently delete a user from the system'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'User ID',
    type: 'number'
  })
  @ApiOkResponse({ 
    description: 'User successfully deleted',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'User deleted successfully'
        }
      }
    }
  })
  @ApiNotFoundResponse({ 
    description: 'User not found' 
  })
  @ApiUnauthorizedResponse({ 
    description: 'Invalid or missing authentication token' 
  })
  async remove(@Param('id') id: string) {
    await this.usersService.remove(+id);
    return { message: 'User deleted successfully' };
  }
} 