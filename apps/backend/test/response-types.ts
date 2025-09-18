import type { Response } from 'supertest';

type TypedResponse<T> = Omit<Response, 'body'> & { body: T };

type AuthSuccessResponseBody = {
  user: {
    id: number;
    email: string;
    nome: string;
  };
  accessToken: string;
};

type AuthConflictErrorResponseBody = {
  message: string;
  error: string;
  status: number;
};

type AuthSuccessResponse = TypedResponse<AuthSuccessResponseBody>;
type AuthConflictErrorResponse = TypedResponse<AuthConflictErrorResponseBody>;

export type { AuthSuccessResponse, AuthConflictErrorResponse };
