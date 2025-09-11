import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

/* eslint-disable @typescript-eslint/no-unsafe-assignment  */
/* eslint-disable @typescript-eslint/no-unsafe-member-access  */
/* eslint-disable @typescript-eslint/no-unsafe-return  */
/* eslint-disable @typescript-eslint/require-await  */

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_ACCESS_SECRET || 'your-access-secret',
    });
  }

  async validate(payload: any) {
    if (payload.type !== 'access') {
      throw new UnauthorizedException('Tipo de token inválido');
    }
    return { userId: payload.userId, type: payload.type };
  }
}
