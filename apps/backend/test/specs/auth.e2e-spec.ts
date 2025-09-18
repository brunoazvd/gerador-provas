import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Server } from 'http';
import {
  AuthSuccessResponse,
  AuthConflictErrorResponse,
} from '../response-types';
import { ERROR_MESSAGES } from '@app/shared';
import { getApp } from '../setup-e2e';
import { makeRegisterDto } from '@factories/auth.factory';

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

const invalidPasswords = [
  '123',
  'nodigitsss',
  'abc123',
  'a2b4c'.repeat(13),
  ...invalidFormats
];

describe('register', () => {
  let app: INestApplication<Server>;

  beforeAll(async () => {
    app = getApp();
  });

  it('deve criar um usuário com sucesso', async () => {
    const dto = makeRegisterDto();

    const response: AuthSuccessResponse = await request(app.getHttpServer())
      .post('/auth/register')
      .send(dto);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('user');
    expect(response.body).toHaveProperty('accessToken');
    expect(response.body.user.email).toBe(dto.email);
    expect(response.body.user.nome).toBe(dto.nome);
  });

  it('deve lançar erro de conflito se o email já existir', async () => {
    const dto = makeRegisterDto();

    const response: AuthConflictErrorResponse = await request(
      app.getHttpServer(),
    )
      .post('/auth/register')
      .send(dto);

    expect(response.status).toBe(409);
    expect(response.body.message).toBe(ERROR_MESSAGES.EMAIL_ALREADY_IN_USE);
  });

  it.each(invalidEmails)('deve lançar erro se email for de formato inválido: %s', async (invalidEmail: any) => {
    const dto = makeRegisterDto({email: invalidEmail});
    const response: AuthConflictErrorResponse = await request(
      app.getHttpServer(),
    )
      .post('/auth/register')
      .send(dto);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(ERROR_MESSAGES.INVALID_EMAIL_FORMAT);
  });

  it.each(invalidNames)('deve lançar erro se nome for de formato inválido: %s', async (invalidName: any) => {
    const dto = makeRegisterDto({nome: invalidName});
    const response: AuthConflictErrorResponse = await request(
      app.getHttpServer(),
    )
      .post('/auth/register')
      .send(dto);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(ERROR_MESSAGES.INVALID_NAME);
  });

  it.each(invalidPasswords)('deve lançar erro se senha for de formato inválido: %s', async (invalidPassword: any) => {
    const dto = makeRegisterDto({senha: invalidPassword});

    const response: AuthConflictErrorResponse = await request(
      app.getHttpServer(),
    )
      .post('/auth/register')
      .send(dto);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(ERROR_MESSAGES.INVALID_PASSWORD);
  });
});
