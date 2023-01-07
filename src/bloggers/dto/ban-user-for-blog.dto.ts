import { Transform } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsString, MinLength } from 'class-validator';

import {
  MIN_LENGTH_ERROR,
  NOT_STRING_ERROR,
} from 'root/@common/error-messages';
import { IsId } from 'root/@common/decorators/sql-id.validator.decorator';

export class BanUserForBlogDTO {
  @IsString({ message: NOT_STRING_ERROR })
  @Transform(({ value }) => typeof value === 'string' && value.trim())
  @IsNotEmpty()
  @MinLength(15, { message: MIN_LENGTH_ERROR(15) })
  banReason: string;

  @IsBoolean()
  isBanned: boolean;

  // @ObjectId()
  @IsId()
  blogId: string;
}
