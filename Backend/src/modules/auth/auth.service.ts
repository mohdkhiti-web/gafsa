import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

interface User {
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

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<Omit<User, 'password'> | null> {
    console.log(' Validating user:', email);
    const user = await this.usersService.findByEmail(email);
    console.log(' User found:', user ? 'Yes' : 'No');
    
    if (user) {
      if (user.status && user.status !== 'ACTIVE') {
        console.log(' User status not active:', user.status);
        return null;
      }
      console.log(' Comparing passwords...');
      const isPasswordValid = await bcrypt.compare(password, user.password);
      console.log(' Password valid:', isPasswordValid);
      
      if (isPasswordValid) {
        const { password, ...result } = user;
        return result;
      }
    }
    return null;
  }

  async login(user: Omit<User, 'password'>) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async register(userData: any) {
    console.log(' Registering user:', userData.email);
    const user = await this.usersService.create({
      ...userData,
      role: userData.role || 'USER'
    });
    
    console.log(' User created successfully');
    return this.login(user);
  }

  async refreshToken(user: Omit<User, 'password'>) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }
} 