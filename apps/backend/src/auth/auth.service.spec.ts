import { Test, TestingModule } from "@nestjs/testing";
import { ConflictException, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AuthService } from "./auth.service";
import { PrismaService } from "../prisma/prisma.service";
import * as bcrypt from "bcryptjs";
import { Usuario } from "@prisma/client";

jest.mock("bcryptjs");

describe("AuthService", () => {
  let service: AuthService;
  let prismaService: PrismaService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            usuario: {
              findUnique: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
            },
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe("register", () => {
    it("deve criar novo usuário com sucesso", async () => {
      const registerDto = {
        nome: "Novo Usuário",
        email: "test@test.com",
        senha: "senha123456",
      };

      jest.spyOn(prismaService.usuario, "findUnique").mockResolvedValue(null);
      jest.spyOn(prismaService.usuario, "create").mockResolvedValue({
        id: 1,
        nome: "Novo Usuário",
        email: "test@test.com",
        senhaHash: expect.any(String),
        refreshTokenHash: expect.any(String),
        criadoEm: expect.any(String),
      });
      jest.spyOn(jwtService, "sign").mockReturnValue("mock-token");

      const result = await service.register(registerDto);

      expect(result).toHaveProperty("user");
      expect(result).toHaveProperty("accessToken");
      expect(result).toHaveProperty("refreshToken");
    });

    it("deve lançar ConflictException se email já existir", async () => {
      const registerDto = {
        nome: "Novo Usuário",
        email: "test@test.com",
        senha: "senha123456",
      };

      jest.spyOn(prismaService.usuario, "findUnique").mockResolvedValue({
        id: 1,
        nome: expect.any(String),
        email: expect.any(String),
        senhaHash: expect.any(String),
        refreshTokenHash: expect.any(String),
        criadoEm: expect.any(String),
      });

      await expect(service.register(registerDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it("deve hashar a senha corretamente", async () => {
      const registerDto = {
        nome: "Novo Usuário",
        email: "test@test.com",
        senha: "senha123456",
      };

      jest.spyOn(prismaService.usuario, "findUnique").mockResolvedValue(null);
      jest.spyOn(prismaService.usuario, "create").mockResolvedValue({
        id: 1,
        nome: "Novo Usuário",
        email: "test@test.com",
        senhaHash: expect.any(String),
        refreshTokenHash: expect.any(String),
        criadoEm: expect.any(String),
      });
      jest.spyOn(jwtService, "sign").mockReturnValue("mock-token");

      await service.register(registerDto);

      expect(bcrypt.hash).toHaveBeenCalledWith(registerDto.senha, 12);
    });

    it("não deve salvar senha em claro", async () => {
      const registerDto = {
        nome: "Novo Usuário",
        email: "test@test.com",
        senha: "senha123456",
      };

      jest.spyOn(prismaService.usuario, "findUnique").mockResolvedValue(null);
      (jest.spyOn(bcrypt, "hash") as jest.Mock).mockResolvedValue("fake-hash");
      jest.spyOn(prismaService.usuario, "create").mockResolvedValue({
        id: 1,
        nome: "Novo Usuário",
        email: "test@test.com",
        senhaHash: "fake-hash",
        refreshTokenHash: expect.any(String),
        criadoEm: expect.any(String),
      });
      jest.spyOn(jwtService, "sign").mockReturnValue("mock-token");

      await service.register(registerDto);

      expect(jest.spyOn(prismaService.usuario, "create")).toHaveBeenCalledWith({
        data: {
          nome: registerDto.nome,
          email: registerDto.email,
          senhaHash: "fake-hash",
          refreshTokenHash: "mock-token",
        },
        select: {
          id: true,
          nome: true,
          email: true,
        },
      });
    });

    it("deve chamar sign 2x com os argumentos corretos", async () => {
      const registerDto = {
        nome: "Novo Usuário",
        email: "test@test.com",
        senha: "senha123456",
      };

      jest.spyOn(prismaService.usuario, "findUnique").mockResolvedValue(null);
      jest.spyOn(prismaService.usuario, "create").mockResolvedValue({
        id: 1,
        nome: "Novo Usuário",
        email: "test@test.com",
        senhaHash: expect.any(String),
        refreshTokenHash: expect.any(String),
        criadoEm: expect.any(String),
      });
      jest.spyOn(jwtService, "sign").mockReturnValue("mock-token");

      await service.register(registerDto);

      expect(jest.spyOn(jwtService, "sign")).toHaveBeenCalledWith(
        { timestamp: expect.any(Number), type: "refresh" },
        {
          secret: process.env.JWT_REFRESH_SECRET,
          expiresIn: process.env.REFRESH_TOKEN_DURATION,
        },
      );
      expect(jest.spyOn(jwtService, "sign")).toHaveBeenCalledWith(
        { timestamp: expect.any(Number), type: "access", userId: 1 },
        {
          secret: process.env.JWT_ACCESS_SECRET,
          expiresIn: process.env.ACCESS_TOKEN_DURATION,
        },
      );
    });
  });

  describe("login", () => {
    it("deve retornar um accessToken e um refreshToken, ambos string", async () => {
      const loginDto = {
        email: "test@test.com",
        senha: "senha123456",
      };

      jest.spyOn(prismaService.usuario, "findUnique").mockResolvedValue({
        id: 1,
        nome: expect.any(String),
        email: loginDto.email,
        senhaHash: "fake-hash",
        refreshTokenHash: "old-token",
        criadoEm: expect.any(String),
      });

      (jest.spyOn(bcrypt, "compare") as jest.Mock).mockResolvedValue(true);
      jest.spyOn(jwtService, "sign").mockReturnValue("mock-token");

      const result = await service.login(loginDto);

      // result deve conter user, accessToken e refreshToken
      expect(result).toHaveProperty("user");
      expect(result).toHaveProperty("accessToken");
      expect(result).toHaveProperty("refreshToken");
      // tokens devem ser strings
      expect(typeof result.accessToken).toBe("string");
      expect(typeof result.refreshToken).toBe("string");
    });

    it("refreshToken deve ser diferente do token anterior", async () => {
      const loginDto = {
        email: "test@test.com",
        senha: "senha123456",
      };
      const oldToken = "old-token";

      jest.spyOn(prismaService.usuario, "findUnique").mockResolvedValue({
        id: 1,
        nome: expect.any(String),
        email: loginDto.email,
        senhaHash: "fake-hash",
        refreshTokenHash: oldToken,
        criadoEm: expect.any(String),
      });

      (jest.spyOn(bcrypt, "compare") as jest.Mock).mockResolvedValue(true);
      jest.spyOn(jwtService, "sign").mockReturnValue("mock-token");

      const result = await service.login(loginDto);
      // refreshToken deve ser diferente do token previamente em uso
      expect(result.refreshToken).not.toBe(oldToken);
    });

    it("deve lançar UnauthorizedException se senha for incorreta", async () => {
      const loginDto = {
        email: "test@test.com",
        senha: "senha123456",
      };

      jest.spyOn(prismaService.usuario, "findUnique").mockResolvedValue({
        id: 1,
        nome: expect.any(String),
        email: loginDto.email,
        senhaHash: "fake-hash",
        refreshTokenHash: "old-token",
        criadoEm: expect.any(String),
      });

      (jest.spyOn(bcrypt, "compare") as jest.Mock).mockResolvedValue(false);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it("deve lançar UnauthorizedException se email for incorreto", async () => {
      const loginDto = {
        email: "test@test.com",
        senha: "senha123456",
      };

      jest.spyOn(prismaService.usuario, "findUnique").mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe("getUserById", () => {
    it("deve retornar os dados do usuário", async () => {
      const userId = 1;

      jest.spyOn(prismaService.usuario, "findUnique").mockResolvedValueOnce({
        id: userId,
        nome: "Teste",
        email: "test@test.com",
      } as unknown as Usuario);

      const result = await service.getUserById(userId);

      expect(result).toEqual({
        id: userId,
        nome: "Teste",
        email: "test@test.com",
      });
    });
  });

  describe("logout", () => {
    it("deve limpar o refreshTokenHash do usuário", async () => {
      const userId = 1;
      await service.logout(userId);
      expect(jest.spyOn(prismaService.usuario, "update")).toHaveBeenCalledWith({
        where: { id: userId },
        data: { refreshTokenHash: null },
      });
    });
  });

  describe("refreshAccessToken", () => {
    it("deve retornar um accessToken", async () => {
      const refreshToken = "refreshToken";
      jest.spyOn(prismaService.usuario, "findUnique").mockResolvedValue({
        id: 1,
        nome: "Teste",
        email: "test@test.com",
        senhaHash: "fake-hash",
        refreshTokenHash: refreshToken,
        criadoEm: expect.any(String),
      });
      const result = await service.refreshAccessToken(refreshToken);
      expect(result).toHaveProperty("accessToken");
    });
  });
});
