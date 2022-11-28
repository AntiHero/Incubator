import { Transform } from 'class-transformer';
import { IsEnum, IsString } from 'class-validator';

import { LikeStatuses } from 'root/@common/types/enum';
import { NOT_STRING_ERROR, WRONG_VALUE } from 'root/@common/error-messages';

export class LikePostDTO {
  @IsString({ message: NOT_STRING_ERROR })
  @Transform(({ value }) => typeof value === 'string' && value.trim())
  @IsEnum(LikeStatuses, { message: WRONG_VALUE })
  likeStatus: LikeStatuses;
}
