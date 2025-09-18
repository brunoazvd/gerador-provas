import { TypedResponse } from './index';

type AuthSuccessResponseBody = {
  user: {
    id: number;
    email: string;
    nome: string;
  };
  accessToken: string;
};

type AuthErrorResponseBody = {
  message: string;
  error: string;
  status: number;
};

type AuthSuccessResponse = TypedResponse<AuthSuccessResponseBody>;
type AuthErrorResponse = TypedResponse<AuthErrorResponseBody>;

export type { AuthSuccessResponse, AuthErrorResponse };
