import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('health')
  @HttpCode(HttpStatus.OK)
  getHealth(): object {
    return this.authService.getHealth();
  }
}
