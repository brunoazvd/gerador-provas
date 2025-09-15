import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

/* eslint-disable @typescript-eslint/require-await  */

interface JwtPayload {
  userId: number;
  type: 'access' | 'refresh';
  iat?: number;
  exp?: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_ACCESS_SECRET || 'your-access-secret',
    });
  }

  async validate(payload: JwtPayload) {
    if (payload.type !== 'access') {
      throw new UnauthorizedException('Tipo de token inválido');
    }
    return { userId: payload.userId, type: payload.type };
  }
}
