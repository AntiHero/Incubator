import {
  Injectable,
  HttpStatus,
  PipeTransform,
  HttpException,
} from '@nestjs/common';

@Injectable()
export class FileTypeValidationPipe implements PipeTransform {
  public types: string[] = [];

  constructor(...types: string[]) {
    this.types = types;
  }

  transform(value: Express.Multer.File) {
    if (!this.types.some((type) => value.mimetype?.includes(type))) {
      throw new HttpException(
        {
          field: 'file',
          message: 'Wrong type',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    return value;
  }
}
