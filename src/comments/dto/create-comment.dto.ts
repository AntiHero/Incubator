import { Transform } from 'class-transformer';
import { IsString, MaxLength, MinLength } from 'class-validator';

import {
  MAX_LENGTH_ERROR,
  MIN_LENGTH_ERROR,
  NOT_STRING_ERROR,
} from 'root/@common/errorMessages';

export class CreateCommentDTO {
  @IsString({ message: NOT_STRING_ERROR })
  @Transform(({ value }) => typeof value === 'string' && value.trim())
  @MaxLength(300, { message: MAX_LENGTH_ERROR(300) })
  @MinLength(20, { message: MIN_LENGTH_ERROR(20) })
  content: string;
}
