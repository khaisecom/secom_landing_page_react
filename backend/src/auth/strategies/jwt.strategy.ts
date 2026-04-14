import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service.js';

export interface JwtPayload {
  sub: number;
  email: string;
  role: string;
}

function extractJwtFromCookie(req: Request): string | null {
  return req.cookies?.access_token ?? null;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private prisma: PrismaService,
    configService: ConfigService,
  ) {
    super({
      jwtFromRequest: extractJwtFromCookie,
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.prisma.tbl_system_users.findUnique({
      where: { id: BigInt(payload.sub) },
    });

    if (!user || !user.is_enabled) {
      throw new UnauthorizedException('User not found or disabled');
    }

    return {
      id: Number(user.id),
      email: user.email,
      role: user.role,
      fullname: user.fullname,
    };
  }
}
