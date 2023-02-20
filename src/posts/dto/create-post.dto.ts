import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, MaxLength, Validate } from 'class-validator';

import { ObjectId } from 'root/@core/decorators/object-id-validator.decorator';
import { CheckBlogExistance } from 'root/@core/decorators/check-blog-existance.decorator';

import { MAX_LENGTH_ERROR, NOT_STRING_ERROR } from 'root/@core/error-messages';

export class CreatePostDTO {
  @IsString({ message: NOT_STRING_ERROR })
  @Transform(({ value }) => typeof value === 'string' && value.trim())
  @IsNotEmpty()
  @MaxLength(30, { message: MAX_LENGTH_ERROR(30) })
  title: string;

  @IsString({ message: NOT_STRING_ERROR })
  @Transform(({ value }) => typeof value === 'string' && value.trim())
  @IsNotEmpty()
  @MaxLength(100, { message: MAX_LENGTH_ERROR(100) })
  shortDescription: string;

  @IsString({ message: NOT_STRING_ERROR })
  @Transform(({ value }) => typeof value === 'string' && value.trim())
  @IsNotEmpty()
  @MaxLength(1000, { message: MAX_LENGTH_ERROR(1000) })
  content: string;

  @IsString({ message: NOT_STRING_ERROR })
  @Transform(({ value }) => typeof value === 'string' && value.trim())
  @IsNotEmpty()
  @ObjectId()
  @Validate(CheckBlogExistance)
  blogId: string;
}
