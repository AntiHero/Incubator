import {
  ArgumentMetadata,
  HttpException,
  HttpStatus,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

import { CodeDTO } from 'root/auth/dto/code.dto';
import { CheckUserConfirmationCodeUseCase } from 'root/users/use-cases/check-user-confirmation-code.use-case';

@Injectable()
export class RegistrationCodeValidationPipe implements PipeTransform {
  constructor(private readonly service: CheckUserConfirmationCodeUseCase) {}

  async transform(value: CodeDTO, metadata: ArgumentMetadata) {
    if (metadata.type !== 'body') return value;

    const registration = await this.service.execute(value.code);

    if (!registration)
      throw new HttpException(
        {
          message: 'Invalid confirmation code',
          field: 'code',
        },
        HttpStatus.BAD_REQUEST,
      );

    return value;
  }
}
