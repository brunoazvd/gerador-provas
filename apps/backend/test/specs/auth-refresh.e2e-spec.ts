import { ERROR_MESSAGES } from "@app/shared";
import {
  AuthSuccessResponse,
  AuthErrorResponse,
  RefreshAcessTokenSuccessResponse,
} from "@test-types/auth.types";
import { makeRegisterDto } from "@factories/auth.factory";
import {
  expectRegisterSuccess,
  expectAuthError,
  expectRefreshAccessTokenSuccess,
  register,
  refreshAccessToken,
} from "@test-helpers/auth.helpers";
import { getApp } from "../setup-e2e";
import { INestApplication } from "@nestjs/common";
import { Server } from "http";

describe("refresh accessToken", () => {
  let app: INestApplication<Server>, accessToken: string, refreshToken: string;
  const testUser: { email: string; nome: string; senha: string } = {
    email: "refresh@teste.com",
    nome: "Refresh Teste",
    senha: "Senha123",
  };
  beforeAll(async () => {
    app = getApp();
    const dto = makeRegisterDto({ ...testUser });
    const response: AuthSuccessResponse = await register(app, dto);
    expectRegisterSuccess(response, dto);
    accessToken = response.body.accessToken;
    refreshToken = response.headers["set-cookie"]["0"]
      .split(";")[0]
      .split("=")[1];
  });

  it("deve renovar o accessToken com sucesso", async () => {
    const response: RefreshAcessTokenSuccessResponse = await refreshAccessToken(
      app,
      refreshToken,
    );
    expectRefreshAccessTokenSuccess(response, accessToken);
  });

  it("deve retornar aluno se utilizando includeUser flag", async () => {
    const response: RefreshAcessTokenSuccessResponse = await refreshAccessToken(
      app,
      refreshToken,
      true,
    );
    expectRefreshAccessTokenSuccess(response, accessToken, testUser);
  });

  it("deve lançar erro se refreshToken for inválido", async () => {
    const response: AuthErrorResponse = await refreshAccessToken(
      app,
      "invalidToken",
    );
    expectAuthError(response, 401, ERROR_MESSAGES.REFRESH_TOKEN_INVALID);
  });

  it("deve lançar erro se refreshToken não estiver presente", async () => {
    const response: AuthErrorResponse = await refreshAccessToken(app);
    expectAuthError(response, 401, ERROR_MESSAGES.REFRESH_TOKEN_NOT_FOUND);
  });
});
