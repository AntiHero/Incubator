import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { APIErrorResult, FieldError } from '../types';
import { ErrorsResponse } from '../utils/customExceptionFactory';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    let errorsResponse = new ErrorsResponse();

    const exceptionRes = exception.getResponse();

    if (typeof exceptionRes === 'object') {
      if (exceptionRes instanceof ErrorsResponse) {
        errorsResponse = exceptionRes;
      } else {
        errorsResponse.errorsMessages.push(exceptionRes as FieldError);
      }
    }

    response
      .type('text/plain')
      .status(status)
      .send(JSON.stringify(errorsResponse));
    // response.status(status).send(exception.getResponse());
  }
}
