import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { APIErrorResult, FieldError } from '../types';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    const errorsResponse: APIErrorResult = { errorsMessages: [] };

    const exceptionRes = exception.getResponse();

    if (typeof exceptionRes === 'object') {
      errorsResponse.errorsMessages.push(exceptionRes as FieldError);
    } else {
      errorsResponse.errorsMessages.push(
        JSON.parse(exceptionRes) as FieldError,
      );
    }

    response.status(status).send(errorsResponse);
  }
}
