import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';

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
          message: 'Token expirado',
          statusCode: 401,
        };
        break;
      case 'INVALID_TOKEN_TYPE':
        errorResponse = {
          code: 'INVALID_TOKEN_TYPE',
          message: 'Tipo de token inválido',
          statusCode: 401,
        };
        break;
      default:
        errorResponse = {
          code: 'UNAUTHORIZED',
          message: message || 'Não autorizado',
          statusCode: 401,
        };
    }

    response.status(401).json(errorResponse);
  }
}
