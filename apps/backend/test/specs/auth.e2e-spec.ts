import request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ValidationExceptionFilter } from '@common/filters/validation-exception.filter';
import { AuthExceptionFilter } from '@common/filters/auth-exception.filter';
import { Server } from 'http';
import { AppModule } from '@src/app.module';
import { PrismaService } from '@prisma-module/prisma.service';
import {
  AuthSuccessResponse,
  AuthConflictErrorResponse,
} from '../response-types';
import { ERROR_MESSAGES } from '@app/shared';

const invalidFormats = [
  true,
  123,
  123.456,
  null,
  undefined,
  [],
  {},
  () => 'teste'
]

describe('AuthController (e2e)', () => {
  let app: INestApplication<Server>;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }));

    app.useGlobalFilters(
        new ValidationExceptionFilter(),
        new AuthExceptionFilter(),
      );
    await app.init();
    prisma = app.get(PrismaService);
  });

  afterAll(async () => {
    await app.close();
    await prisma.$disconnect();
  });


  describe('register', () => {
    it('deve criar um usuário com sucesso', async () => {
      const registerDto = {
        nome: 'Usuario Teste',
        email: 'teste@teste.com',
        senha: 'Senha123',
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
        nome: 'Usuario Teste',
        email: 'teste@teste.com',
        senha: 'Senha123',
      };
  
      const response: AuthConflictErrorResponse = await request(
        app.getHttpServer(),
      )
        .post('/auth/register')
        .send(registerDto);
  
      expect(response.status).toBe(409);
      expect(response.body.message).toBe(ERROR_MESSAGES.EMAIL_ALREADY_IN_USE);
    });
  
    it('deve lançar erro se email for de formato inválido', async () => {
      const invalidEmails = [
        'invalid-format',
        'nodomain@',
        'onlysubdomain@.com',
        'domain.ends.with.dot@.com.',
        'domain.starts.with.dot@.com.com',
        'multiple-ats@.com@.com',
        '.local.starts.with.dot@test.com',
        'local.ends.with.dot.@test.com',
        '-local.starts.with.hyphen@test.com',
        'local.ends.with.hyphen-@test.com',
        'special#character$@test.com',
        'contains space@test.com',
        ...invalidFormats
      ];

      for (const email of invalidEmails) {
        const registerDto = {
          nome: 'Usuario Teste',
          email: email,
          senha: 'senha123',
        };
  
        const response: AuthConflictErrorResponse = await request(
          app.getHttpServer(),
        )
          .post('/auth/register')
          .send(registerDto);

        expect(response.status).toBe(400);
        expect(response.body.message).toBe(ERROR_MESSAGES.INVALID_EMAIL_FORMAT);
      };
    });

    it('deve lançar erro se nome for de formato inválido', async () => {
      const invalidNames = [
        ' João',
        'Espaço  Repetido',
        'Hyphen--Repetido',
        "Apostrofo''repetido",
        'Sou #Especial',
        'Мария',
        'Gabe69',
        ...invalidFormats
      ];

      for (const name of invalidNames) {
        const registerDto = {
          nome: name,
          email: 'nao@importa.com',
          senha: 'senha123',
        };
  
        const response: AuthConflictErrorResponse = await request(
          app.getHttpServer(),
        )
          .post('/auth/register')
          .send(registerDto);

        expect(response.status).toBe(400);
        expect(response.body.message).toBe(ERROR_MESSAGES.INVALID_NAME);
      };
    });

    it('deve lançar erro se senha for de formato inválido', async () => {
      const invalidPasswords = [
        '123',
        'nodigitsss',
        'abc123',
        'a2b4c'.repeat(13),
        ...invalidFormats
      ];

      for (const password of invalidPasswords) {
        const registerDto = {
          nome: 'Usuario Teste',
          email: 'nao@importa.com',
          senha: password,
        };
  
        const response: AuthConflictErrorResponse = await request(
          app.getHttpServer(),
        )
          .post('/auth/register')
          .send(registerDto);

        expect(response.status).toBe(400);
        expect(response.body.message).toBe(ERROR_MESSAGES.INVALID_PASSWORD);
      };
    });
  });
});
