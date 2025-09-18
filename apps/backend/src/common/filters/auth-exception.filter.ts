import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';
import { ERROR_MESSAGES } from '@app/shared';

@Catch(UnauthorizedException)
export class AuthExceptionFilter implements ExceptionFilter {
  catch(exception: UnauthorizedException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const message = exception.message;

    let errorResponse;

    switch (message) {
      case 'TOKEN_EXPIRED':
        errorResponse = {
          code: 'TOKEN_EXPIRED',
          message: ERROR_MESSAGES.TOKEN_EXPIRED,
          statusCode: 401,
        };
        break;
      case 'INVALID_TOKEN_TYPE':
        errorResponse = {
          code: 'INVALID_TOKEN_TYPE',
          message: ERROR_MESSAGES.INVALID_TOKEN_TYPE,
          statusCode: 401,
        };
        break;
      default:
        errorResponse = {
          code: 'UNAUTHORIZED',
          message: message || ERROR_MESSAGES.UNAUTHORIZED,
          statusCode: 401,
        };
    }

    response.status(401).json(errorResponse);
  }
}
