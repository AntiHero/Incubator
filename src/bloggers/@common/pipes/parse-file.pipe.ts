import {
  HttpStatus,
  BadRequestException,
  ParseFilePipeBuilder,
} from '@nestjs/common';

import { MAX_BLOG_WP_SIZE } from '../constants';
import { FieldErrorClass } from 'root/@core/models/Field-Error';
import { ErrorsResponse } from 'root/@core/utils/custom-exception-factory';
import { ImageDimensionsValidatorPipe } from 'root/@core/pipes/image-dimensions-validation.pipe';

export const ParseFileValidationPipe = <
  T extends {
    fileType: string;
    maxSize?: number;
    minHeight: number;
    minWidth: number;
  },
>(
  args: T,
) => {
  const { fileType, maxSize = MAX_BLOG_WP_SIZE, minHeight, minWidth } = args;

  return new ParseFilePipeBuilder()
    .addFileTypeValidator({
      fileType,
    })
    .addMaxSizeValidator({
      maxSize,
    })
    .addValidator(
      new ImageDimensionsValidatorPipe({
        width: minWidth,
        height: minHeight,
      }),
    )
    .build({
      errorHttpStatusCode: HttpStatus.BAD_REQUEST,
      exceptionFactory: (err) => {
        const errorsResponse = new ErrorsResponse();
        errorsResponse.errorsMessages.push(new FieldErrorClass(err, 'file'));
        throw new BadRequestException(errorsResponse);
      },
    });
};
