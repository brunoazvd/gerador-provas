import { ERROR_MESSAGES } from "@app/shared";
import { AuthSuccessResponse, AuthErrorResponse } from "@test-types/auth.types";
import { makeRegisterDto } from "@factories/auth.factory";
import {
  expectRegisterSuccess,
  expectAuthError,
  expectLogoutSuccess,
  register,
  logout,
} from "@test-helpers/auth.helpers";
import { getApp, getPrisma } from "../setup-e2e";
import { INestApplication } from "@nestjs/common";
import { Server } from "http";
import { PrismaService } from "@prisma-module/prisma.service";
import { Response } from "supertest";

describe("logout", () => {
  let app: INestApplication<Server>, accessToken: string, refreshToken: string;
  let prisma: PrismaService;
  const testUser: { email: string; nome: string; senha: string } = {
    email: "logout@teste.com",
    nome: "Logout Teste",
    senha: "Senha123",
  };

  beforeAll(async () => {
    app = getApp();
    prisma = getPrisma();
    const dto = makeRegisterDto({ ...testUser });
    const response: AuthSuccessResponse = await register(app, dto);
    expectRegisterSuccess(response, dto);
    accessToken = response.body.accessToken;
  });

  it("deve remover o refreshToken do banco de dados e limpar o cookie", async () => {
    const response: Response = await logout(app, accessToken);
    expectLogoutSuccess(response, prisma, testUser.email);
    const user = await prisma.usuario.findUnique({
      where: {
        email: testUser.email,
      },
    });
    expect(user?.refreshTokenHash).toBe(null);
  });

  it("deve lançar erro se accessToken for inválido", async () => {
    const response: AuthErrorResponse = await logout(app, "invalidToken");
    expectAuthError(response, 401, ERROR_MESSAGES.INVALID_TOKEN);
  });

  it("deve lançar erro se accessToken não estiver presente", async () => {
    const response: AuthErrorResponse = await logout(app);
    expectAuthError(response, 401, ERROR_MESSAGES.INVALID_TOKEN);
  });
});
