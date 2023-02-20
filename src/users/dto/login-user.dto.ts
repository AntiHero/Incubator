import { Transform } from 'class-transformer';
import { IsString, MaxLength, MinLength } from 'class-validator';

import {
  MAX_LENGTH_ERROR,
  MIN_LENGTH_ERROR,
  NOT_STRING_ERROR,
} from 'root/@core/error-messages';

const MIN_PASSWORD_LEN = 6;
const MAX_PASSWORD_LEN = 20;

export class LoginUserDTO {
  @IsString({ message: NOT_STRING_ERROR })
  @Transform(({ value }) => typeof value === 'string' && value.trim())
  loginOrEmail: string;

  @IsString({ message: NOT_STRING_ERROR })
  @Transform(({ value }) => value.trim())
  @MaxLength(MAX_PASSWORD_LEN, { message: MAX_LENGTH_ERROR(MAX_PASSWORD_LEN) })
  @MinLength(MIN_PASSWORD_LEN, { message: MIN_LENGTH_ERROR(MIN_PASSWORD_LEN) })
  password: string;
}
