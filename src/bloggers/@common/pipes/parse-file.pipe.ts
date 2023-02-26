import {
  HttpStatus,
  BadRequestException,
  ParseFilePipeBuilder,
} from '@nestjs/common';

import { MAX_BLOGS_WP_SIZE } from '../constants';
import { FieldErrorClass } from 'root/@core/models/Field-Error';
import { ErrorsResponse } from 'root/@core/utils/custom-exception-factory';

export const ParseFileValidationPipe = <
  T extends {
    fileType: string;
    maxSize?: number;
  },
>(
  args: T,
) => {
  const { fileType, maxSize = MAX_BLOGS_WP_SIZE } = args;

  return new ParseFilePipeBuilder()
    .addFileTypeValidator({
      fileType,
    })
    .addMaxSizeValidator({
      maxSize,
    })
    .build({
      errorHttpStatusCode: HttpStatus.BAD_REQUEST,
      exceptionFactory: (err) => {
        const errorsResponse = new ErrorsResponse();
        errorsResponse.errorsMessages.push(new FieldErrorClass(err, 'file'));
        throw new BadRequestException(errorsResponse);
      },
    });
};
