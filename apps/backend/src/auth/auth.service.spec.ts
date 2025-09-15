import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
jest.mock('bcryptjs');

describe('AuthService', () => {
  let service: AuthService;
  let prismaService: PrismaService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            usuario: {
              findUnique: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
            },
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('register', () => {
    it('deve criar novo usuário com sucesso', async () => {
      const registerDto = {
        nome: 'Novo Usuário',
        email: 'test@test.com',
        senha: 'senha123456',
      };

      jest.spyOn(prismaService.usuario, 'findUnique').mockResolvedValue(null);
      jest.spyOn(prismaService.usuario, 'create').mockResolvedValue({
        id: 1,
        nome: 'Novo Usuário',
        email: 'test@test.com',
        senhaHash: expect.any(String),
        refreshTokenHash: expect.any(String),
        criadoEm: expect.any(String),
      });
      jest.spyOn(jwtService, 'sign').mockReturnValue('mock-token');

      const result = await service.register(registerDto);

      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
    });

    it('deve lançar ConflictException se email já existir', async () => {
      const registerDto = {
        nome: 'Novo Usuário',
        email: 'test@test.com',
        senha: 'senha123456',
      };

      jest.spyOn(prismaService.usuario, 'findUnique').mockResolvedValue({
        id: 1,
        nome: expect.any(String),
        email: expect.any(String),
        senhaHash: expect.any(String),
        refreshTokenHash: expect.any(String),
        criadoEm: expect.any(String),
      });

      await expect(service.register(registerDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('deve hashar a senha corretamente', async () => {
      const registerDto = {
        nome: 'Novo Usuário',
        email: 'test@test.com',
        senha: 'senha123456',
      };

      jest.spyOn(prismaService.usuario, 'findUnique').mockResolvedValue(null);
      jest.spyOn(prismaService.usuario, 'create').mockResolvedValue({
        id: 1,
        nome: 'Novo Usuário',
        email: 'test@test.com',
        senhaHash: expect.any(String),
        refreshTokenHash: expect.any(String),
        criadoEm: expect.any(String),
      });
      jest.spyOn(jwtService, 'sign').mockReturnValue('mock-token');

      await service.register(registerDto);

      expect(bcrypt.hash).toHaveBeenCalledWith(registerDto.senha, 12);
    });

    it('não deve salvar senha em claro', async () => {
      const registerDto = {
        nome: 'Novo Usuário',
        email: 'test@test.com',
        senha: 'senha123456',
      };

      jest.spyOn(prismaService.usuario, 'findUnique').mockResolvedValue(null);
      (jest.spyOn(bcrypt, 'hash') as jest.Mock).mockResolvedValue('fake-hash');
      jest.spyOn(prismaService.usuario, 'create').mockResolvedValue({
        id: 1,
        nome: 'Novo Usuário',
        email: 'test@test.com',
        senhaHash: 'fake-hash',
        refreshTokenHash: expect.any(String),
        criadoEm: expect.any(String),
      });
      jest.spyOn(jwtService, 'sign').mockReturnValue('mock-token');

      await service.register(registerDto);

      expect(jest.spyOn(prismaService.usuario, 'create')).toHaveBeenCalledWith({
        data: {
          nome: registerDto.nome,
          email: registerDto.email,
          senhaHash: 'fake-hash',
          refreshTokenHash: 'mock-token',
        },
        select: {
          id: true,
          nome: true,
          email: true,
        },
      });
    });

    it('deve chamar sign 2x com os argumentos corretos', async () => {
      const registerDto = {
        nome: 'Novo Usuário',
        email: 'test@test.com',
        senha: 'senha123456',
      };

      jest.spyOn(prismaService.usuario, 'findUnique').mockResolvedValue(null);
      jest.spyOn(prismaService.usuario, 'create').mockResolvedValue({
        id: 1,
        nome: 'Novo Usuário',
        email: 'test@test.com',
        senhaHash: expect.any(String),
        refreshTokenHash: expect.any(String),
        criadoEm: expect.any(String),
      });
      jest.spyOn(jwtService, 'sign').mockReturnValue('mock-token');

      await service.register(registerDto);

      expect(jest.spyOn(jwtService, 'sign')).toHaveBeenCalledWith(
        { timestamp: expect.any(Number), type: 'refresh' },
        {
          secret: process.env.JWT_REFRESH_SECRET,
          expiresIn: process.env.REFRESH_TOKEN_DURATION,
        },
      );
      expect(jest.spyOn(jwtService, 'sign')).toHaveBeenCalledWith(
        { userId: 1, type: 'access' },
        {
          secret: process.env.JWT_ACCESS_SECRET,
          expiresIn: process.env.ACCESS_TOKEN_DURATION,
        },
      );
    });
  });
});
