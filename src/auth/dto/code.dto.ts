import { IsString } from 'class-validator';
import { Transform } from 'class-transformer';

import { NOT_STRING_ERROR } from 'root/@core/error-messages';

export class CodeDTO {
  @IsString({ message: NOT_STRING_ERROR })
  @Transform(({ value }) => typeof value === 'string' && value.trim())
  code: string;
}
