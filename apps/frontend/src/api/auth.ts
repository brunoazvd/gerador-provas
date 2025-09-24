import { api } from "@lib/api-client";
import type { User } from "@app/shared";

type LoginResponse = {
  user: User;
  accessToken: string;
};

export async function login(
  email: string,
  password: string,
): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>("/auth/login", {
    email,
    password,
  });
  return data;
}
