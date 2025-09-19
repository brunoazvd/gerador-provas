import { ERROR_MESSAGES } from '@app/shared';
import { AuthSuccessResponse, AuthErrorResponse } from '@test-types/auth.types';
import { makeRegisterDto } from '@factories/auth.factory';
import {
  invalidEmails,
  invalidNames,
  invalidPasswords,
} from '@test-data/auth.data';
import {
  expectRegisterSuccess,
  expectAuthError,
  register,
} from '@test-helpers/auth.helpers';
import { getApp } from '../setup-e2e';
import { INestApplication } from '@nestjs/common';
import { Server } from 'http';

describe('register', () => {
  let app: INestApplication<Server>;

  beforeAll(async () => {
    app = getApp();
  });

  it('deve criar um usuário com sucesso', async () => {
    const dto = makeRegisterDto();
    const response: AuthSuccessResponse = await register(app, dto);
    expectRegisterSuccess(response, dto);
  });

  it('deve lançar erro de conflito se o email já existir', async () => {
    const dto = makeRegisterDto();
    const response: AuthErrorResponse = await register(app, dto);
    expectAuthError(response, 409, ERROR_MESSAGES.EMAIL_ALREADY_IN_USE);
  });

  it.each(invalidEmails)(
    'deve lançar erro se email for de formato inválido: %s',
    async ([_, invalidEmail]: [string, any]) => {
      const dto = makeRegisterDto({ email: invalidEmail });
      const response: AuthErrorResponse = await register(app, dto);
      expectAuthError(response, 400, ERROR_MESSAGES.INVALID_EMAIL_FORMAT);
    },
  );

  it.each(invalidNames)(
    'deve lançar erro se nome for de formato inválido: %s',
    async ([_, invalidName]: [string, any]) => {
      const dto = makeRegisterDto({ nome: invalidName });
      const response: AuthErrorResponse = await register(app, dto);
      expectAuthError(response, 400, ERROR_MESSAGES.INVALID_NAME);
    },
  );

  it.each(invalidPasswords)(
    'deve lançar erro se senha for de formato inválido: %s',
    async ([_, invalidPassword]: [string, any]) => {
      const dto = makeRegisterDto({ senha: invalidPassword });
      const response: AuthErrorResponse = await register(app, dto);
      expectAuthError(response, 400, ERROR_MESSAGES.INVALID_PASSWORD);
    },
  );
});
