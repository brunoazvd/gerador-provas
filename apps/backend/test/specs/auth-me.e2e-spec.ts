import { ERROR_MESSAGES } from "@app/shared";
import {
  GetAuthenticatedUserSuccessResponse,
  AuthSuccessResponse,
  AuthErrorResponse,
} from "@test-types/auth.types";
import { makeRegisterDto } from "@factories/auth.factory";
import {
  expectRegisterSuccess,
  expectAuthError,
  expectAuthMeSuccess,
  register,
  getAuthenticatedUser,
} from "@test-helpers/auth.helpers";
import { getApp } from "../setup-e2e";
import { INestApplication } from "@nestjs/common";
import { Server } from "http";
import { invalidTokens, expiredToken } from "@test-data/auth.data";

describe.only("getAuthenticatedUser", () => {
  let app: INestApplication<Server>, accessToken: string;
  const testUser: { email: string; nome: string; senha: string } = {
    email: "authenticated@user.com",
    nome: "Authenticated User",
    senha: "Senha123",
  };
  beforeAll(async () => {
    app = getApp();
    const dto = makeRegisterDto({ ...testUser });
    const response: AuthSuccessResponse = await register(app, dto);
    expectRegisterSuccess(response, dto);
    accessToken = response.body.accessToken;
  });

  it("token válido deve retornar o usuário autenticado", async () => {
    const response: GetAuthenticatedUserSuccessResponse =
      await getAuthenticatedUser(app, accessToken);
    expectAuthMeSuccess(response, testUser);
  });

  it.each(invalidTokens)(
    "deve lançar erro se token for inválido: %s",
    async ([_, invalidToken]: [string, any]) => {
      const response: AuthErrorResponse = await getAuthenticatedUser(
        app,
        invalidToken,
      );
      expectAuthError(response, 401, ERROR_MESSAGES.INVALID_TOKEN);
    },
  );

  it("token expirado deve retornar erro", async () => {
    const response: AuthErrorResponse = await getAuthenticatedUser(
      app,
      expiredToken,
    );
    expectAuthError(response, 401, ERROR_MESSAGES.TOKEN_EXPIRED);
  });
});
