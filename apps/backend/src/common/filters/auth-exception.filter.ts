import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  UnauthorizedException,
} from "@nestjs/common";
import { Response } from "express";
import { ERROR_MESSAGES } from "@app/shared";

@Catch(UnauthorizedException)
export class AuthExceptionFilter implements ExceptionFilter {
  catch(exception: UnauthorizedException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const code = exception.message;

    const errorResponse: { code: string; message: string; statusCode: number } =
      {
        code: code.toUpperCase() || "UNAUTHORIZED",
        message: ERROR_MESSAGES[code] || ERROR_MESSAGES.INVALID_TOKEN,
        statusCode: 401,
      };

    response.status(401).json(errorResponse);
  }
}
