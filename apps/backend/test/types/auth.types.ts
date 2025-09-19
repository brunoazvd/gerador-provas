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

type GetAuthenticatedUserSuccessResponseBody = {
  id: number;
  email: string;
  nome: string;
}

type RefreshAcessTokenSuccessResponseBody = {
  accessToken: string
  user? : {
    id: number;
    email: string;
    nome: string;
  }
}

type GetAuthenticatedUserSuccessResponse = TypedResponse<GetAuthenticatedUserSuccessResponseBody>
type AuthSuccessResponse = TypedResponse<AuthSuccessResponseBody>;
type AuthErrorResponse = TypedResponse<AuthErrorResponseBody>;
type RefreshAcessTokenSuccessResponse = TypedResponse<RefreshAcessTokenSuccessResponseBody>

export type { AuthSuccessResponse, AuthErrorResponse, GetAuthenticatedUserSuccessResponse, RefreshAcessTokenSuccessResponse };
