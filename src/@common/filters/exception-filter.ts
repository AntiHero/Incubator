import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { FieldError } from '../types';
import { ErrorsResponse } from '../utils/customExceptionFactory';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    let errorsResponse = new ErrorsResponse();

    const exceptionResponse = exception.getResponse();

    if (typeof exceptionResponse === 'object') {
      if (exceptionResponse instanceof ErrorsResponse) {
        errorsResponse = exceptionResponse;
      } else {
        errorsResponse.errorsMessages.push(exceptionResponse as FieldError);
      }
    }

    response
      .type('text/plain')
      .status(status)
      .send(
        typeof errorsResponse === 'string'
          ? exceptionResponse
          : JSON.stringify(errorsResponse),
      );
  }
}
