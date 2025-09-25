import { loginSchema, registerSchema } from "@app/shared";
import { createZodDto } from "nestjs-zod";

export class LoginRequestDto extends createZodDto(loginSchema) {}

export class RegisterRequestDto extends createZodDto(
  registerSchema.omit({ confirmarSenha: true }),
) {}

export class RefreshRequestDto {
  cookies: {
    refreshToken?: string;
  };
}
