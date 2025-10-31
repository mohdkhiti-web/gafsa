import { Controller, Post, Body, UseGuards, Request, Get, HttpCode, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBody, 
  ApiBearerAuth,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';

// Response DTOs for Swagger documentation
export class LoginResponseDto {
  access_token: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
}

export class UserProfileDto {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: Date;
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'User login',
    description: 'Authenticate user with email and password'
  })
  @ApiBody({ 
    type: LoginDto,
    description: 'Login credentials'
  })
  @ApiOkResponse({ 
    description: 'Login successful',
    type: LoginResponseDto
  })
  @ApiUnauthorizedResponse({ 
    description: 'Invalid credentials' 
  })
  @ApiBadRequestResponse({ 
    description: 'Invalid input data' 
  })
  async login(@Body() loginDto: LoginDto) {
    try {
      const user = await this.authService.validateUser(loginDto.email, loginDto.password);
      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }
      return this.authService.login(user);
    } catch (error) {
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ 
    summary: 'User registration',
    description: 'Register a new user account'
  })
  @ApiBody({ 
    type: RegisterDto,
    description: 'User registration data'
  })
  @ApiCreatedResponse({ 
    description: 'Registration successful',
    type: LoginResponseDto
  })
  @ApiBadRequestResponse({ 
    description: 'Invalid input data or user already exists' 
  })
  async register(@Body() userData: RegisterDto) {
    return this.authService.register(userData);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiOperation({ 
    summary: 'Get current user profile',
    description: 'Retrieve the profile of the authenticated user'
  })
  @ApiBearerAuth('JWT-auth')
  @ApiOkResponse({ 
    description: 'User profile retrieved successfully',
    type: UserProfileDto
  })
  @ApiUnauthorizedResponse({ 
    description: 'Invalid or missing token' 
  })
  async getProfile(@Request() req) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'User logout',
    description: 'Logout the current user (token invalidation handled client-side)'
  })
  @ApiBearerAuth('JWT-auth')
  @ApiOkResponse({ 
    description: 'Logout successful' 
  })
  @ApiUnauthorizedResponse({ 
    description: 'Invalid or missing token' 
  })
  async logout(@Request() req) {
    // In a real implementation, you might want to blacklist the token
    return { message: 'Logout successful' };
  }

  @UseGuards(JwtAuthGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Refresh access token',
    description: 'Get a new access token using the current valid token'
  })
  @ApiBearerAuth('JWT-auth')
  @ApiOkResponse({ 
    description: 'Token refreshed successfully',
    type: LoginResponseDto
  })
  @ApiUnauthorizedResponse({ 
    description: 'Invalid or expired token' 
  })
  async refreshToken(@Request() req) {
    return this.authService.refreshToken(req.user);
  }
} 