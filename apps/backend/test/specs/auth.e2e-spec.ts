import request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Server } from 'http';
import { AppModule } from '@src/app.module';
import { PrismaService } from '@prisma-module/prisma.service';
import {
  AuthSuccessResponse,
  AuthConflictErrorResponse,
} from '../response-types';
import { ERROR_MESSAGES } from '@shared/enums/error-messages';

describe('AuthController (e2e)', () => {
  let app: INestApplication<Server>;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
    prisma = app.get(PrismaService);
  });

  afterAll(async () => {
    await app.close();
    await prisma.$disconnect();
  });

  it('deve criar um usuário com sucesso', async () => {
    const registerDto = {
      nome: 'Usuário Teste',
      email: 'teste@teste.com',
      senha: 'senha123',
    };

    const response: AuthSuccessResponse = await request(app.getHttpServer())
      .post('/auth/register')
      .send(registerDto);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('user');
    expect(response.body).toHaveProperty('accessToken');
    expect(response.body.user.email).toBe(registerDto.email);
    expect(response.body.user.nome).toBe(registerDto.nome);
  });

  it('deve lançar erro de conflito se o email já existir', async () => {
    const registerDto = {
      nome: 'Usuário Teste',
      email: 'teste@teste.com',
      senha: 'senha123',
    };

    const response: AuthConflictErrorResponse = await request(
      app.getHttpServer(),
    )
      .post('/auth/register')
      .send(registerDto);

    expect(response.status).toBe(409);
    expect(response.body.message).toBe(ERROR_MESSAGES.EMAIL_ALREADY_IN_USE);
    expect(response.body.error).toBe('Conflict');
  });
});
