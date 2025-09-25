import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { Server } from "http";
import { AppModule } from "@src/app.module";
import { PrismaService } from "@prisma-module/prisma.service";
import { ValidationExceptionFilter } from "@common/filters/validation-exception.filter";
import { AuthExceptionFilter } from "@common/filters/auth-exception.filter";
import cookieParser from "cookie-parser";

let app: INestApplication<Server>;
let prisma: PrismaService;

beforeAll(async () => {
  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  app = moduleRef.createNestApplication();
  app.use(cookieParser());

  app.useGlobalFilters(
    new ValidationExceptionFilter(),
    new AuthExceptionFilter(),
  );
  await app.init();

  prisma = app.get(PrismaService);
});

afterAll(async () => {
  await app.close();
  await prisma.$disconnect();
});

export const getApp = () => app;
export const getPrisma = () => prisma;
