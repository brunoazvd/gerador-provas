import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  BadRequestException,
} from "@nestjs/common";
import { Response } from "express";
import { ZodIssue } from "zod";

interface ZodErrorResponse {
  statusCode: number;
  message: string;
  errors: ZodIssue[];
}

@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();
    let exceptionMessage: string = "";

    if (typeof exceptionResponse === "string") {
      exceptionMessage = exceptionResponse;
    } else if (typeof exceptionResponse === "object") {
      exceptionMessage = (exceptionResponse as ZodErrorResponse).errors[0]
        .message;
    }

    // Customizar formato do erro
    const errorResponse = {
      error: "Validation",
      message: exceptionMessage,
      statusCode: status,
    };

    response.status(status).json(errorResponse);
  }
}
