import { ValidationError } from 'class-validator';
import { BadRequestException } from '@nestjs/common';

import { APIErrorResult, FieldError } from '../types';

export class ErrorsResponse implements APIErrorResult {
  errorsMessages: FieldError[] = [];
}

export const exceptionFactory = (errors: ValidationError[]) => {
  const errorsResponse = new ErrorsResponse();

  errors.forEach((error) => {
    const errorMessage: FieldError = {
      message: JSON.stringify(error.constraints),
      field: error.property,
    };

    errorsResponse.errorsMessages.push(errorMessage);
  });

  throw new BadRequestException(errorsResponse);
};
