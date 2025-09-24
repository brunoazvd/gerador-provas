import { Module } from "@nestjs/common";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./auth/auth.module";
import { JwtStrategy } from "./common/strategies/jwt.strategy";

@Module({
  imports: [PrismaModule, AuthModule],
  providers: [JwtStrategy],
})
export class AppModule {}
