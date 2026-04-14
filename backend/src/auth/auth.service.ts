import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service.js';
import { LoginDto } from './dto/login.dto.js';
import { RegisterDto } from './dto/register.dto.js';
import { JwtPayload } from './strategies/jwt.strategy.js';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.prisma.tbl_system_users.findFirst({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.tbl_system_users.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        role: 'ROLE_CUSTOMER',
        is_enabled: true,
        is_verified: true, // just add true because this login just for the system : admin,marketing team...
        created_at: new Date(),
        created_by: dto.email,
      },
    });

    const payload: JwtPayload = {
      sub: Number(user.id),
      email: user.email!,
      role: user.role!,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: Number(user.id),
        email: user.email,
        role: user.role,
      },
    };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.tbl_system_users.findFirst({
      where: { email: dto.email },
    });

    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload: JwtPayload = {
      sub: Number(user.id),
      email: user.email!,
      role: user.role!,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: Number(user.id),
        email: user.email,
        fullname: user.fullname,
        role: user.role,
        company: user.company,
      },
    };
  }

  async getProfile(userId: number) {
    const user = await this.prisma.tbl_system_users.findUnique({
      where: { id: BigInt(userId) },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return {
      id: Number(user.id),
      email: user.email,
      fullname: user.fullname,
      role: user.role,
      company: user.company,
      phone: user.phone,
    };
  }
}
