import { Transform } from 'class-transformer';
import { IsString, Matches } from 'class-validator';

import {
  NOT_STRING_ERROR,
  WRONG_PATTERN_ERROR,
} from 'root/@common/errorMessages';

export class EmailDTO {
  @IsString({ message: NOT_STRING_ERROR })
  @Transform(({ value }) => typeof value === 'string' && value.trim())
  @Matches(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/, { message: WRONG_PATTERN_ERROR })
  email: string;
}
