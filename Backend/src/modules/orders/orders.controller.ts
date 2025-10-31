import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth,
  ApiParam,
  ApiBody,
  ApiQuery,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

// DTOs for Swagger documentation
class OrderResponseDto {
  id: number;
  userId: number;
  orderItems: object[];
  totalAmount: number;
  status: string;
  paymentMethod?: string;
  shippingAddress?: string;
  notes?: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

class CreateOrderRequestDto {
  orderItems: object[];
  totalAmount: number;
  status?: string;
  paymentMethod?: string;
  shippingAddress?: string;
  notes?: string;
  imageUrl?: string;
}

class UpdateOrderRequestDto {
  orderItems?: object[];
  totalAmount?: number;
  status?: string;
  paymentMethod?: string;
  shippingAddress?: string;
  notes?: string;
  imageUrl?: string;
}

@ApiTags('orders')
@Controller('orders')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ 
    summary: 'Create a new order',
    description: 'Create a new order for the authenticated user'
  })
  @ApiBody({ 
    type: CreateOrderRequestDto,
    description: 'Order creation data'
  })
  @ApiCreatedResponse({ 
    description: 'Order successfully created',
    type: OrderResponseDto
  })
  @ApiBadRequestResponse({ 
    description: 'Invalid input data' 
  })
  @ApiUnauthorizedResponse({ 
    description: 'Invalid or missing authentication token' 
  })
  async create(@Body() createOrderDto: CreateOrderDto, @Request() req): Promise<OrderResponseDto> {
    return this.ordersService.create({
      ...createOrderDto,
      userId: req.user.id,
    });
  }

  @Get()
  @ApiOperation({ 
    summary: 'Get all orders',
    description: 'Retrieve a list of all orders, optionally filtered by status'
  })
  @ApiQuery({ 
    name: 'status', 
    required: false,
    description: 'Filter orders by status (e.g., "pending", "processing", "completed", "cancelled")',
    type: 'string'
  })
  @ApiOkResponse({ 
    description: 'List of orders retrieved successfully',
    type: [OrderResponseDto]
  })
  @ApiUnauthorizedResponse({ 
    description: 'Invalid or missing authentication token' 
  })
  async findAll(@Query('status') status?: string): Promise<OrderResponseDto[]> {
    if (status) {
      return this.ordersService.findByStatus(status);
    }
    return this.ordersService.findAll();
  }

  @Get('my-orders')
  @ApiOperation({ 
    summary: 'Get user orders',
    description: 'Retrieve all orders belonging to the authenticated user'
  })
  @ApiOkResponse({ 
    description: 'User orders retrieved successfully',
    type: [OrderResponseDto]
  })
  @ApiUnauthorizedResponse({ 
    description: 'Invalid or missing authentication token' 
  })
  async findMyOrders(@Request() req): Promise<OrderResponseDto[]> {
    return this.ordersService.findByUserId(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Get order by ID',
    description: 'Retrieve a specific order by its ID'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Order ID',
    type: 'number'
  })
  @ApiOkResponse({ 
    description: 'Order retrieved successfully',
    type: OrderResponseDto
  })
  @ApiNotFoundResponse({ 
    description: 'Order not found' 
  })
  @ApiUnauthorizedResponse({ 
    description: 'Invalid or missing authentication token' 
  })
  async findOne(@Param('id') id: string): Promise<OrderResponseDto> {
    return this.ordersService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ 
    summary: 'Update order',
    description: 'Update an existing order\'s information'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Order ID',
    type: 'number'
  })
  @ApiBody({ 
    type: UpdateOrderRequestDto,
    description: 'Order update data'
  })
  @ApiOkResponse({ 
    description: 'Order successfully updated',
    type: OrderResponseDto
  })
  @ApiBadRequestResponse({ 
    description: 'Invalid input data' 
  })
  @ApiNotFoundResponse({ 
    description: 'Order not found' 
  })
  @ApiUnauthorizedResponse({ 
    description: 'Invalid or missing authentication token' 
  })
  async update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto): Promise<OrderResponseDto> {
    return this.ordersService.update(+id, updateOrderDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Delete order',
    description: 'Permanently remove an order from the system'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Order ID',
    type: 'number'
  })
  @ApiOkResponse({ 
    description: 'Order successfully deleted',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Order deleted successfully'
        }
      }
    }
  })
  @ApiNotFoundResponse({ 
    description: 'Order not found' 
  })
  @ApiUnauthorizedResponse({ 
    description: 'Invalid or missing authentication token' 
  })
  async remove(@Param('id') id: string) {
    await this.ordersService.remove(+id);
    return { message: 'Order deleted successfully' };
  }
} 