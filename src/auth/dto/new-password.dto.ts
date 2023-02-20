import {
  IsString,
  Matches,
  MaxLength,
  MinLength,
  Validate,
} from 'class-validator';
import { Transform } from 'class-transformer';

import {
  MAX_LENGTH_ERROR,
  MIN_LENGTH_ERROR,
  NOT_STRING_ERROR,
  NOT_UUID_ERROR,
} from 'root/@core/error-messages';
import { MAX_PASSWORD_LEN, MIN_PASSWORD_LEN } from 'root/@core/constants';
import { ValidateRecoveryCode } from 'root/@core/decorators/validate-uuid.decorator';

export class NewPasswordDTO {
  @IsString({ message: NOT_STRING_ERROR })
  @Transform(({ value }) => typeof value === 'string' && value.trim())
  @MaxLength(MAX_PASSWORD_LEN, { message: MAX_LENGTH_ERROR(MAX_PASSWORD_LEN) })
  @MinLength(MIN_PASSWORD_LEN, { message: MIN_LENGTH_ERROR(MIN_PASSWORD_LEN) })
  newPassword: string;

  @IsString({ message: NOT_STRING_ERROR })
  @Transform(({ value }) => typeof value === 'string' && value.trim())
  @Matches(
    /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i,
    { message: NOT_UUID_ERROR },
  )
  @Validate(ValidateRecoveryCode)
  recoveryCode: string;
}
