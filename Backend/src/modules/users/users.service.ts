import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

interface UserWithPassword {
  id: number;
  email: string;
  name: string;
  role: string;
  password: string;
  phone?: string;
  address?: string;
  createdAt: Date;
  updatedAt: Date;
  status?: string;
}

interface UserWithoutPassword {
  id: number;
  email: string;
  name: string;
  role: string;
  phone?: string;
  address?: string;
  createdAt: Date;
  updatedAt: Date;
  status?: string;
}

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<UserWithoutPassword> {
    console.log('🏗️ Creating user with data:', { ...createUserDto, password: '[HIDDEN]' });
    // Normalize email
    const normalizedEmail = createUserDto.email.trim().toLowerCase();
    
    // Prevent duplicates
    const existing = await this.prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (existing) {
      throw new BadRequestException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    console.log('🔒 Password hashed');

    const { status, ...userData } = createUserDto as any;
    const user = await this.prisma.user.create({
      data: {
        ...userData,
        email: normalizedEmail,
        password: hashedPassword,
      },
    });
    console.log('✅ User created in database:', { id: user.id, email: user.email });
    
    const { password, ...result } = user;
    return result;
  }

  async findAll(): Promise<UserWithoutPassword[]> {
    const users = await this.prisma.user.findMany({
      include: {
        lands: true,
        orders: true,
      },
    });
    return users.map(user => {
      const { password, ...result } = user;
      return result;
    });
  }

  async findOne(id: number): Promise<UserWithoutPassword> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        lands: true,
        orders: true,
      },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    const { password, ...result } = user;
    return result;
  }

  async findByEmail(email: string): Promise<UserWithPassword | null> {
    console.log('🔍 Finding user by email:', email);
    const normalizedEmail = email.trim().toLowerCase();
    const user = await this.prisma.user.findUnique({
      where: { email: normalizedEmail },
    });
    console.log('👤 User found by email:', user ? { id: user.id, email: user.email } : 'No user found');
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<UserWithoutPassword> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    let data = { ...updateUserDto };
    if (updateUserDto.password) {
      data.password = await bcrypt.hash(updateUserDto.password, 10);
    }
    if ('status' in data) {
      delete (data as any).status;
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data,
    });
    const { password, ...result } = updatedUser;
    return result;
  }

  async remove(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    await this.prisma.user.delete({
      where: { id },
    });
    return { message: 'User deleted successfully' };
  }
} 