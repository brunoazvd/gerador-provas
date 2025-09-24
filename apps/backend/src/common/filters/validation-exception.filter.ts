import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  BadRequestException,
} from "@nestjs/common";
import { Response } from "express";

@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();
    const exceptionMessage: string =
      typeof exceptionResponse === "string"
        ? exceptionResponse
        : (exceptionResponse as { message: string }).message;

    // Customizar formato do erro
    const errorResponse = {
      error: "Validation",
      message: exceptionMessage,
      statusCode: status,
    };

    response.status(status).json(errorResponse);
  }
}
