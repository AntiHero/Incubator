import {
  HttpStatus,
  Injectable,
  PipeTransform,
  HttpException,
  ArgumentMetadata,
} from '@nestjs/common';

@Injectable()
export class IdValidationPipe implements PipeTransform {
  transform(value, metadata: ArgumentMetadata) {
    if (!/id/i.test(metadata.data)) return value;

    if (isNaN(value)) {
      throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
    }

    return value;
  }
}
