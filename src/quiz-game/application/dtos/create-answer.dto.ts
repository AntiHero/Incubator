import { Transform } from 'class-transformer';
import { IsString } from 'class-validator';

import { NOT_STRING_ERROR } from 'root/@core/error-messages';

export class CreateAnswerDTO {
  @IsString({ message: NOT_STRING_ERROR })
  @Transform(({ value: v }) => typeof v === 'string' && v.trim().toLowerCase())
  // @ValidateIf((_, value) => value !== null)
  answer: string;
}
