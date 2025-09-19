import { ERROR_MESSAGES } from '@app/shared';
import { AuthSuccessResponse, AuthErrorResponse } from '@test-types/auth.types';
import { makeLoginDto, makeRegisterDto } from '@factories/auth.factory';
import {
  invalidEmails,
  invalidPasswords,
} from '@test-data/auth.data';
import {
  expectRegisterSuccess,
  expectLoginSuccess,
  expectAuthError,
  register,
  login,
} from '@test-helpers/auth.helpers';
import { getApp } from '../setup-e2e';
import { INestApplication } from '@nestjs/common';
import { Server } from 'http';

describe('login', () => {
  let app: INestApplication<Server>;
  let testUser: { email: string; nome: string; senha: string } = {
    'email': 'login@teste.com',
    'nome': 'Login Teste',
    'senha': 'Senha123',
  }
  beforeAll(async () => {
    app = getApp();
    const dto = makeRegisterDto({...testUser});
    const response: AuthSuccessResponse = await register(app, dto);
    expectRegisterSuccess(response, dto);
  });

  it('deve logar um usuário com sucesso', async () => {
    const dto = makeLoginDto({email: testUser.email, senha: testUser.senha});
    const loginResponse: AuthSuccessResponse = await login(app, dto);
    expectLoginSuccess(loginResponse, dto);
  });

  it('deve lançar erro se email estiver incorreto', async () => {
    const dto = makeLoginDto({email: 'errou@teste.com', senha: testUser.senha});
    const response: AuthErrorResponse = await login(app, dto);
    expectAuthError(response, 401, ERROR_MESSAGES.INVALID_CREDENTIALS);
  })

  it('deve lançar erro se senha estiver incorreta', async () => {
    const dto = makeLoginDto({email: testUser.email, senha: 'Errou1234'});
    const response: AuthErrorResponse = await login(app, dto);
    expectAuthError(response, 401, ERROR_MESSAGES.INVALID_CREDENTIALS);
  })

  it.each(invalidEmails)(
    'deve lançar erro se email for de formato inválido: %s',
    async ([_, invalidEmail]: [string, any]) => {
      const dto = makeLoginDto({ email: invalidEmail });
      const response: AuthErrorResponse = await login(app, dto);
      expectAuthError(response, 400, ERROR_MESSAGES.INVALID_EMAIL_FORMAT);
    },
  );

  it.each(invalidPasswords)(
    'deve lançar erro se senha for de formato inválido: %s',
    async ([_, invalidPassword]: [string, any]) => {
      const dto = makeLoginDto({ senha: invalidPassword });
      const response: AuthErrorResponse = await login(app, dto);
      expectAuthError(response, 400, ERROR_MESSAGES.INVALID_PASSWORD);
    },
  );
});