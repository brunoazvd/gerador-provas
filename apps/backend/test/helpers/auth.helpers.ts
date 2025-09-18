import { AuthSuccessResponse, AuthErrorResponse } from '@test-types/auth.types';

export const expectAuthSuccess = (response: AuthSuccessResponse, dto: any) => {
  expect(response.status).toBe(201);
  expect(response.body).toHaveProperty('user');
  expect(response.body).toHaveProperty('accessToken');
  expect(response.body.user.email).toBe(dto.email);
  expect(response.body.user.nome).toBe(dto.nome);
};

export const expectRegisterError = (
  response: AuthErrorResponse,
  statusCode: number,
  message: string,
) => {
  expect(response.status).toBe(statusCode);
  expect(response.body.message).toBe(message);
};
