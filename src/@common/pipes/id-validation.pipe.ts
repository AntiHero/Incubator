import {
  ArgumentMetadata,
  // BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class IdValidationPipe implements PipeTransform {
  transform(value, metadata: ArgumentMetadata) {
    if (!/id/i.test(metadata.data)) return value;

    if (isNaN(value)) {
      // throw new BadRequestException('Id is not valid');
      throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
    }

    return value;
  }
}
