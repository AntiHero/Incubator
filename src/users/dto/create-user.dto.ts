import { Transform } from 'class-transformer';
import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

import {
  MAX_LENGTH_ERROR,
  MIN_LENGTH_ERROR,
  NOT_STRING_ERROR,
  WRONG_PATTERN_ERROR,
} from 'root/@common/errorMessages';

const MIN_PASSWORD_LEN = 6;
const MAX_PASSWORD_LEN = 20;

const MIN_LOGIN_LEN = 3;
const MAX_LOGIN_LEN = 10;

export class CreateUserDto {
  @IsString({ message: NOT_STRING_ERROR })
  @Transform(({ value }) => typeof value === 'string' && value.trim())
  @Matches(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/, { message: WRONG_PATTERN_ERROR })
  email: string;

  @IsString({ message: NOT_STRING_ERROR })
  @Transform(({ value }) => typeof value === 'string' && value.trim())
  @MaxLength(MAX_LOGIN_LEN, { message: MAX_LENGTH_ERROR(MAX_LOGIN_LEN) })
  @MinLength(MIN_LOGIN_LEN, { message: MIN_LENGTH_ERROR(MIN_LOGIN_LEN) })
  login: string;

  @IsString({ message: NOT_STRING_ERROR })
  @Transform(({ value }) => value.trim())
  @MaxLength(MAX_PASSWORD_LEN, { message: MAX_LENGTH_ERROR(MAX_PASSWORD_LEN) })
  @MinLength(MIN_PASSWORD_LEN, { message: MIN_LENGTH_ERROR(MIN_PASSWORD_LEN) })
  password: string;
}
