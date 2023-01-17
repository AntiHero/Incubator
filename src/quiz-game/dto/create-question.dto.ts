import { Transform } from 'class-transformer';
import { IsArray, IsString, MaxLength, MinLength } from 'class-validator';

import {
  MAX_LENGTH_ERROR,
  MIN_LENGTH_ERROR,
  NOT_ARRAY_ERROR,
  NOT_STRING_ERROR,
} from 'root/@common/error-messages';

const MAX_LENGTH = 500;
const MIN_LENGTH = 10;

export class CreateQuestionDto {
  @IsString({ message: NOT_STRING_ERROR })
  @Transform(({ value: v }) => typeof v === 'string' && v.trim())
  @MaxLength(MAX_LENGTH, { message: MAX_LENGTH_ERROR(MAX_LENGTH) })
  @MinLength(MIN_LENGTH, { message: MIN_LENGTH_ERROR(MIN_LENGTH) })
  body: string;

  @IsArray({ message: NOT_ARRAY_ERROR })
  correctAnswers: any[];
}
