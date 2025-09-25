import { User } from "../user/user";

export interface AuthResponse {
  user: User;
  accessToken: string;
}

export interface LogoutResponse {
  message: string;
}

export interface LoginRequest {
  email: string;
  senha: string;
}

export interface RegisterRequest {
  email: string;
  senha: string;
  nome: string;
}

export interface JwtPayload {
  userId: number;
  type: "access" | "refresh";
  iat?: number;
  exp?: number;
}

export interface RefreshTokenResponse {
  user?: User;
  accessToken: string;
}
