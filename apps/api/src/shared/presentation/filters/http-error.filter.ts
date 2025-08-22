import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpErrorFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();

    // Validation errors (from ValidationPipe)
    if (exception instanceof BadRequestException) {
      const resp: any = exception.getResponse();
      const message = Array.isArray(resp?.message)
        ? resp.message.join(', ')
        : resp?.message || 'Bad Request';
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message,
          details: resp,
        },
      });
    }

    // Other HttpExceptions
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const resp: any = exception.getResponse();
      const message =
        typeof resp === 'object' && resp?.message
          ? resp.message
          : exception.message;
      return res.status(status).json({
        success: false,
        error: {
          code: HttpStatus[status] || 'HTTP_ERROR',
          message,
          details: typeof resp === 'object' ? resp : undefined,
        },
      });
    }

    // Unknown errors
    const message =
      exception instanceof Error ? exception.message : 'Internal Server Error';
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message,
      },
    });
  }
}
