// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  // 1. Signup Logic
  async signup(email: string, password: string) {
    // Check karo ke user pehle se exist to nahi karta
    const existingUser = await this.usersRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Password hash karo (Security)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Naya user banao aur save karo
    const newUser = this.usersRepository.create({
      email,
      password: hashedPassword,
    });

    return this.usersRepository.save(newUser);
  }

  // 2. Login Logic
  async login(email: string, password: string) {
    // Pehle user dhundo Database mein
    const user = await this.usersRepository.findOne({ where: { email } });

    // Agar user nahi mila
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Password compare karo
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // JWT Token generate karo
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}