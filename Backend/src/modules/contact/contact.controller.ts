import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
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
class ContactResponseDto {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

class CreateContactRequestDto {
  name: string;
  email: string;
  subject: string;
  message: string;
  status?: string;
}

@ApiTags('contact')
@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ 
    summary: 'Create new contact message',
    description: 'Submit a new contact message'
  })
  @ApiBody({ 
    type: CreateContactRequestDto,
    description: 'Contact message data'
  })
  @ApiCreatedResponse({ 
    description: 'Contact message successfully created',
    type: ContactResponseDto
  })
  @ApiBadRequestResponse({ 
    description: 'Invalid input data' 
  })
  async create(@Body() createContactDto: CreateContactDto): Promise<ContactResponseDto> {
    const contact = await this.contactService.create(createContactDto);
    return contact as ContactResponseDto;
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Get all contact messages',
    description: 'Retrieve all contact messages (admin only)'
  })
  @ApiOkResponse({ 
    description: 'List of all contact messages',
    type: [ContactResponseDto]
  })
  @ApiUnauthorizedResponse({ 
    description: 'Invalid or missing authentication token' 
  })
  async findAll(): Promise<ContactResponseDto[]> {
    const contacts = await this.contactService.findAll();
    return contacts as ContactResponseDto[];
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Get contact message by ID',
    description: 'Retrieve a specific contact message by ID'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Contact message ID',
    type: 'number'
  })
  @ApiOkResponse({ 
    description: 'Contact message found',
    type: ContactResponseDto
  })
  @ApiNotFoundResponse({ 
    description: 'Contact message not found' 
  })
  @ApiUnauthorizedResponse({ 
    description: 'Invalid or missing authentication token' 
  })
  async findOne(@Param('id') id: string): Promise<ContactResponseDto> {
    const contact = await this.contactService.findOne(+id);
    return contact as ContactResponseDto;
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Update contact message',
    description: 'Update a contact message (admin only)'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Contact message ID',
    type: 'number'
  })
  @ApiBody({ 
    type: CreateContactRequestDto,
    description: 'Updated contact message data'
  })
  @ApiOkResponse({ 
    description: 'Contact message successfully updated',
    type: ContactResponseDto
  })
  @ApiNotFoundResponse({ 
    description: 'Contact message not found' 
  })
  @ApiUnauthorizedResponse({ 
    description: 'Invalid or missing authentication token' 
  })
  async update(@Param('id') id: string, @Body() updateContactDto: UpdateContactDto): Promise<ContactResponseDto> {
    const contact = await this.contactService.update(+id, updateContactDto);
    return contact as ContactResponseDto;
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Delete contact message',
    description: 'Delete a contact message (admin only)'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Contact message ID',
    type: 'number'
  })
  @ApiOkResponse({ 
    description: 'Contact message successfully deleted' 
  })
  @ApiNotFoundResponse({ 
    description: 'Contact message not found' 
  })
  @ApiUnauthorizedResponse({ 
    description: 'Invalid or missing authentication token' 
  })
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    await this.contactService.remove(+id);
    return { message: 'Contact message deleted successfully' };
  }
}
