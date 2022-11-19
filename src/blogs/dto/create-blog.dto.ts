import { Transform } from 'class-transformer';
import { IsString, Matches, MaxLength } from 'class-validator';

import {
  NOT_STRING_ERROR,
  WRONG_PATTERN_ERROR,
} from 'root/@common/errorMessages';

export class CreateBlogDTO {
  @IsString({ message: NOT_STRING_ERROR })
  @Transform(({ value }) => typeof value === 'string' && value.trim())
  @Matches(
    /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/,
    { message: WRONG_PATTERN_ERROR },
  )
  websiteUrl: string;

  @IsString({ message: NOT_STRING_ERROR })
  @Transform(({ value }) => typeof value === 'string' && value.trim())
  @MaxLength(15)
  name: string;

  @IsString({ message: NOT_STRING_ERROR })
  @Transform(({ value }) => value.trim())
  @MaxLength(500)
  description: string;
}
