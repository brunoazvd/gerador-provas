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
import { Usuario } from '@prisma/client';

/* eslint-disable @typescript-eslint/no-unsafe-assignment  */
/* eslint-disable @typescript-eslint/no-redundant-type-constituents  */
/* eslint-disable @typescript-eslint/no-unsafe-member-access  */
/* eslint-disable @typescript-eslint/no-unsafe-argument  */

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterRequestDto) {
    const { nome, email, senha } = registerDto;

    const existingUser: Usuario | null = await this.prisma.usuario.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Email já está em uso');
    }

    // Hash password and refresh token
    const senhaHash = await bcrypt.hash(senha, 12);
    const refreshToken = this.generateRefreshToken();
    const refreshTokenHash = await bcrypt.hash(refreshToken, 12);

    // Create user
    const user = await this.prisma.usuario.create({
      data: {
        nome,
        email,
        senhaHash,
        refreshTokenHash,
      },
      select: {
        id: true,
        nome: true,
        email: true,
        criadoEm: true,
      },
    });

    // Generate access token
    const accessToken = this.generateAccessToken(user.id);

    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  async login(loginDto: LoginRequestDto) {
    const { email, senha } = loginDto;

    // Find user
    const user = await this.prisma.usuario.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(senha, user.senhaHash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    // Generate new refresh token and hash it
    const refreshToken = this.generateRefreshToken();
    const refreshTokenHash = await bcrypt.hash(refreshToken, 12);

    // Update user with new refresh token hash
    await this.prisma.usuario.update({
      where: { id: user.id },
      data: { refreshTokenHash },
    });

    // Generate access token
    const accessToken = this.generateAccessToken(user.id);

    return {
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        criadoEm: user.criadoEm,
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
}
