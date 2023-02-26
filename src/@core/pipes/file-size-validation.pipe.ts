import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { MAX_BLOGS_WP_SIZE } from 'root/bloggers/@common/constants';

export const FILE_SIZE_VALIDATION_TOKEN = 'SIZE_LIMIT';

@Injectable()
export class FileSizeValidationPipe implements PipeTransform {
  constructor(private sizeLimit: number = MAX_BLOGS_WP_SIZE) {}

  transform(value: Express.Multer.File) {
    if (value.size >= this.sizeLimit) {
      throw new HttpException(
        {
          field: 'file',
          message: 'Size limit exceeded',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    return value;
  }
}
