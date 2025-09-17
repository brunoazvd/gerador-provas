import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Res,
  Get,
  UseGuards,
  Request,
  UnauthorizedException,
  Query,
} from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterRequestDto, RegisterResponseDto } from './dto/register.dto';
import { LoginRequestDto, LoginResponseDto } from './dto/login.dto';
import { RefreshRequestDto, RefreshResponseDto } from './dto/refresh.dto';
import { MeResponseDto } from './dto/me.dto';
import { LogoutResponseDto } from './dto/logout.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { parseTimeToMs } from '../common/helpers/time-parser';
import { CookieOptions } from 'express';
import type { AuthenticatedRequest } from './types/auth.types';

const getCookieOptions = (cookieDuration: string): CookieOptions => {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: parseTimeToMs(cookieDuration),
  };
};

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body() registerDto: RegisterRequestDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<RegisterResponseDto> {
    const result = await this.authService.register(registerDto);
    const cookieOptions = getCookieOptions(
      process.env.REFRESH_TOKEN_DURATION || '7d',
    );
    res.cookie('refreshToken', result.refreshToken, cookieOptions);

    return {
      user: result.user,
      accessToken: result.accessToken,
    };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginRequestDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LoginResponseDto> {
    const result = await this.authService.login(loginDto);
    const cookieOptions = getCookieOptions(
      process.env.REFRESH_TOKEN_DURATION || '7d',
    );
    res.cookie('refreshToken', result.refreshToken, cookieOptions);

    return {
      user: result.user,
      accessToken: result.accessToken,
    };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Request() req: RefreshRequestDto,
    @Query('includeUser') includeUser?: string,
  ): Promise<RefreshResponseDto> {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token não encontrado');
    }
    const result = await this.authService.refreshAccessToken(
      refreshToken,
      includeUser === 'true',
    );
    return result;
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async me(
    @Request() req: AuthenticatedRequest,
  ): Promise<MeResponseDto | null> {
    const userId = req.user.userId;
    const user = await this.authService.getUserById(userId);
    return user;
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async logout(
    @Request() req: AuthenticatedRequest,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LogoutResponseDto> {
    const userId = req.user.userId;
    await this.authService.logout(userId);
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    return { message: 'Logout realizado com sucesso' };
  }
}
