import { Catch, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';
import { BaseException } from '../exceptions/custom-exceptions.exeption';

@Catch(BaseException)
export class HttpExceptionFilter {
  catch(exception: BaseException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const status = exception.getStatus();
    const message = exception.message;

    response.status(status).json({
      statusCode: status,
      message,
    });
  }
}
