import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterRequestDto } from './dto/register.dto';
import { LoginRequestDto } from './dto/login.dto';
import * as bcrypt from 'bcryptjs';
import { RefreshResponseDto } from './dto/refresh.dto';
import type { UserSelect } from './types/auth.types';
import { ERROR_MESSAGES } from '@shared/enums/error-messages';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterRequestDto): Promise<{
    user: UserSelect;
    accessToken: string;
    refreshToken: string;
  }> {
    const { nome, email, senha } = registerDto;

    const existingUser = (await this.prisma.usuario.findUnique({
      where: { email },
      select: {
        id: true,
      },
    })) as UserSelect | null;

    if (existingUser) {
      throw new ConflictException(ERROR_MESSAGES.EMAIL_ALREADY_IN_USE);
    }

    // Hash password and refresh token
    const senhaHash = await bcrypt.hash(senha, 12);
    const refreshToken = this.generateRefreshToken();

    // Create user
    const user = (await this.prisma.usuario.create({
      data: {
        nome,
        email,
        senhaHash,
        refreshTokenHash: refreshToken,
      },
      select: {
        id: true,
        nome: true,
        email: true,
      },
    })) as UserSelect;

    // Generate access token
    const accessToken = this.generateAccessToken(user.id);

    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  async login(
    loginDto: LoginRequestDto,
  ): Promise<{ user: UserSelect; accessToken: string; refreshToken: string }> {
    const { email, senha } = loginDto;

    // Find user
    const user = (await this.prisma.usuario.findUnique({
      where: { email },
      select: {
        id: true,
        nome: true,
        email: true,
        senhaHash: true,
      },
    })) as UserSelect | null;

    if (!user) {
      throw new UnauthorizedException(ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(senha, user.senhaHash || '');

    if (!isPasswordValid) {
      throw new UnauthorizedException(ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    // Generate new refresh token and hash it
    const refreshToken = this.generateRefreshToken();

    // Update user with new refresh token hash
    await this.prisma.usuario.update({
      where: { id: user.id },
      data: { refreshTokenHash: refreshToken },
    });

    // Generate access token
    const accessToken = this.generateAccessToken(user.id);

    return {
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
      },
      accessToken,
      refreshToken,
    };
  }

  private generateAccessToken(userId: number): string {
    return this.jwtService.sign(
      { userId, type: 'access' },
      {
        secret: process.env.JWT_ACCESS_SECRET || 'your-secret-key',
        expiresIn: process.env.ACCESS_TOKEN_DURATION || '60m',
      },
    );
  }

  private generateRefreshToken(): string {
    return this.jwtService.sign(
      { type: 'refresh', timestamp: Date.now() },
      {
        secret: process.env.JWT_REFRESH_SECRET || 'your-secret-key',
        expiresIn: process.env.REFRESH_TOKEN_DURATION || '7d',
      },
    );
  }

  async refreshAccessToken(
    refreshToken: string,
    includeUser = false,
  ): Promise<RefreshResponseDto> {
    try {
      const user = (await this.prisma.usuario.findUnique({
        where: { refreshTokenHash: refreshToken },
        select: {
          id: true,
          nome: true,
          email: true,
        },
      })) as UserSelect | null;

      if (!user) {
        throw new UnauthorizedException(ERROR_MESSAGES.REFRESH_TOKEN_INVALID);
      }

      const accessToken = this.generateAccessToken(user.id);

      return includeUser ? { accessToken, user } : { accessToken };
    } catch (err) {
      throw new UnauthorizedException(err);
    }
  }

  async getUserById(userId: number): Promise<UserSelect | null> {
    const user = (await this.prisma.usuario.findUnique({
      where: { id: userId },
      select: {
        id: true,
        nome: true,
        email: true,
      },
    })) as UserSelect | null;

    if (!user) {
      throw new UnauthorizedException(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    return user;
  }

  async logout(userId: number): Promise<void> {
    await this.prisma.usuario.update({
      where: { id: userId },
      data: { refreshTokenHash: null },
    });
  }
}
