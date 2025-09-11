import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  getHealth(): object {
    return {
      message: 'OK',
    };
  }
}
