import {
  AuthSuccessResponse,
  AuthErrorResponse,
  GetAuthenticatedUserSuccessResponse,
  RefreshAcessTokenSuccessResponse,
} from "@test-types/auth.types";
import { INestApplication } from "@nestjs/common";
import { Server } from "http";
import request, { Response } from "supertest";
import { PrismaService } from "@prisma-module/prisma.service";

export const expectRegisterSuccess = (
  response: AuthSuccessResponse,
  dto: any,
) => {
  expect(response.status).toBe(201);
  expect(response.body).toHaveProperty("user");
  expect(response.body).toHaveProperty("accessToken");
  expect(response.body.user.email).toBe(dto.email);
  expect(response.body.user.nome).toBe(dto.nome);
};

export const expectLoginSuccess = (response: AuthSuccessResponse, dto: any) => {
  expect(response.status).toBe(200);
  expect(response.body).toHaveProperty("user");
  expect(response.body).toHaveProperty("accessToken");
  expect(response.body.user.email).toBe(dto.email);
};

export const expectAuthMeSuccess = (
  response: GetAuthenticatedUserSuccessResponse,
  dto: any,
) => {
  expect(response.status).toBe(200);
  expect(response.body).toHaveProperty("email");
  expect(response.body).toHaveProperty("nome");
  expect(response.body).toHaveProperty("id");
  expect(response.body.email).toBe(dto.email);
  expect(response.body.nome).toBe(dto.nome);
};

export const expectRefreshAccessTokenSuccess = (
  response: RefreshAcessTokenSuccessResponse,
  previousToken: string,
  userDto: any = null,
) => {
  expect(response.status).toBe(200);
  expect(response.body).toHaveProperty("accessToken");
  expect(response.body.accessToken == previousToken).toBe(false);
  if (userDto) {
    expect(response.body).toHaveProperty("user");
    expect(response.body.user).toHaveProperty("email");
    expect(response.body.user).toHaveProperty("nome");
    expect(response.body.user).toHaveProperty("id");
    expect(response.body.user!.email).toBe(userDto.email);
    expect(response.body.user!.nome).toBe(userDto.nome);
  }
};

export const expectAuthError = (
  response: AuthErrorResponse,
  statusCode: number,
  message: string,
) => {
  expect(response.status).toBe(statusCode);
  expect(response.body.message).toBe(message);
};

export const expectLogoutSuccess = (
  response: Response,
  prisma: PrismaService,
  email: string,
) => {
  expect(response.status).toBe(200);
  const setCookie = response.headers["set-cookie"];
  expect(setCookie).toBeDefined();
  expect(setCookie[0]).toMatch(
    "refreshToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT",
  );
};

export const register = async (app: INestApplication<Server>, dto: any) => {
  return request(app.getHttpServer()).post("/auth/register").send(dto);
};

export const login = async (app: INestApplication<Server>, dto: any) => {
  return request(app.getHttpServer()).post("/auth/login").send(dto);
};

export const getAuthenticatedUser = async (
  app: INestApplication<Server>,
  accessToken: string,
) => {
  return request(app.getHttpServer())
    .get("/auth/me")
    .set("Authorization", `Bearer ${accessToken}`)
    .send();
};

export const refreshAccessToken = async (
  app: INestApplication<Server>,
  refreshToken: string = "",
  includeUser: boolean = false,
) => {
  return request(app.getHttpServer())
    .post(`/auth/refresh${includeUser ? "?includeUser=true" : ""}`)
    .set("Cookie", `refreshToken=${refreshToken}`)
    .send();
};
export const logout = async (
  app: INestApplication<Server>,
  accessToken?: string,
) => {
  return request(app.getHttpServer())
    .post("/auth/logout")
    .set("Authorization", `Bearer ${accessToken}`)
    .send();
};
