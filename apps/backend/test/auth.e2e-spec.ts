import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

type RegisterResponse = {
  body: {
    user: {
      id: number;
      email: string;
      nome: string;
    };
    accessToken: string;
  };
};

describe('AuthController (e2e)', () => {
  let app: INestApplication;
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

  it('Register: deve criar um usuário com sucesso', async () => {
    const registerDto = {
      nome: 'Usuário Teste',
      email: 'teste@teste.com',
      senha: 'senha123',
    };
    const response: RegisterResponse = await request(app.getHttpServer())
      .post('/auth/register')
      .send(registerDto)
      .expect(201);

    expect(response.body).toHaveProperty('user');
    expect(response.body).toHaveProperty('accessToken');
    expect(response.body.user.email).toBe(registerDto.email);
    expect(response.body.user.nome).toBe(registerDto.nome);
  });
});
