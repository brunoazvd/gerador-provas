import { api } from "@lib/api-client";
import type {
  RefreshTokenResponse,
  AuthResponse,
  LogoutResponse,
  LoginRequest,
  RegisterRequest,
  User,
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
): Promise<RefreshTokenResponse | null> {
  try {
    const { data } = await api.post<RefreshTokenResponse>(
      `/auth/refresh${includeUser ? "?includeUser=true" : ""}`,
    );
    return data;
  } catch {
    return null;
  }
}

export async function logout(): Promise<LogoutResponse> {
  const { data } = await api.post("/auth/logout");
  return data;
}

export async function getMe(): Promise<User | null> {
  try {
    const { data } = await api.get<User>("/auth/me");
    return data;
  } catch {
    return null;
  }
}
