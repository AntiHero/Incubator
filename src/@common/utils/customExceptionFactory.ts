import { BadRequestException } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { APIErrorResult, FieldError } from '../types';

export const exceptionFactory = (errors: ValidationError[]) => {
  const errorsResponse: APIErrorResult = { errorsMessages: [] };

  errors.forEach((error) => {
    const errorMessage: FieldError = {
      message: JSON.stringify(error.constraints),
      field: error.property,
    };

    errorsResponse.errorsMessages.push(errorMessage);
  });

  throw new BadRequestException(errorsResponse);
};
