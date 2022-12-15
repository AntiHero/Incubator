import { Types } from 'mongoose';
import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class IdValidationPipe implements PipeTransform {
  transform(value, metadata: ArgumentMetadata) {
    if (metadata.data !== 'id') return value;

    if (!Types.ObjectId.isValid(value)) {
      throw new BadRequestException('Id is not valid');
    }

    return value;
  }
}

@Injectable()
export class SqlIdValidationPipe implements PipeTransform {
  transform(value, metadata: ArgumentMetadata) {
    if (metadata.data !== 'id') return value;

    if (Number.isNaN(parseInt(value))) {
      throw new BadRequestException('Id is not valid');
    }

    return value;
  }
}
