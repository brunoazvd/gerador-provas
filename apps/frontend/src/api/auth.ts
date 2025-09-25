import { api } from "@lib/api-client";
import type {
  RefreshTokenResponse,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
} from "@app/shared";

export async function login(payload: LoginRequest): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>("/auth/login", payload);
  return data;
}

export async function register(
  payload: RegisterRequest,
): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>("/auth/register", payload);
  return data;
}

export async function refreshAccessToken(
  includeUser: boolean = false,
): Promise<RefreshTokenResponse> {
  const { data } = await api.post<RefreshTokenResponse>(
    `/auth/refresh${includeUser ? "?includeUser=true" : ""}`,
  );
  return data;
}
