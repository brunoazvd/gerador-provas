import { Module } from "@nestjs/common";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./auth/auth.module";
import { JwtStrategy } from "./common/strategies/jwt.strategy";
import { APP_PIPE } from "@nestjs/core";
import { ZodValidationPipe } from "nestjs-zod";

@Module({
  imports: [PrismaModule, AuthModule],
  providers: [JwtStrategy, { provide: APP_PIPE, useClass: ZodValidationPipe }],
})
export class AppModule {}
