import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

interface JwtPayload {
  userId: number;
  type: 'access' | 'refresh';
  iat?: number;
  exp?: number;
}

/* eslint-disable @typescript-eslint/require-await  */

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: process.env.JWT_ACCESS_SECRET || 'your-access-secret',
    });
  }

  async validate(payload: JwtPayload) {
    // Verificar se token expirou
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      throw new UnauthorizedException('TOKEN_EXPIRED');
    }

    // Verificar tipo do token
    if (payload.type !== 'access') {
      throw new UnauthorizedException('INVALID_TOKEN_TYPE');
    }
    return { userId: payload.userId, type: payload.type };
  }
}
