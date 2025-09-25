import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ValidationExceptionFilter } from "./common/filters/validation-exception.filter";
import { AuthExceptionFilter } from "./common/filters/auth-exception.filter";
import cookieParser from "cookie-parser";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const swaggerConfig = new DocumentBuilder()
    .setTitle("Minha API")
    .setDescription("API exemplo com NestJS e Swagger")
    .setVersion("1.0")
    .build();

  app.use(cookieParser());

  app.enableCors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  });

  app.useGlobalFilters(
    new ValidationExceptionFilter(),
    new AuthExceptionFilter(),
  );

  SwaggerModule.setup(
    "api-docs",
    app,
    SwaggerModule.createDocument(app, swaggerConfig),
  );

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap().catch((err) => {
  console.error("Erro no bootstrap:", err);
});
