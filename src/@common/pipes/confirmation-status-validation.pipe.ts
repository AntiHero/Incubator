import {
  ArgumentMetadata,
  HttpException,
  HttpStatus,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { EmailDTO } from 'root/auth/dto/email.dto';

import { UsersService } from 'root/users/users.service';

@Injectable()
export class ConfirmationStatusValidationPipe implements PipeTransform {
  constructor(private readonly usersService: UsersService) {}

  async transform(value: EmailDTO, metadata: ArgumentMetadata) {
    if (metadata.type !== 'body') return value;

    const user = await this.usersService.findUserByLoginOrEmail(value.email);

    if (!user || user.confirmationInfo.isConfirmed)
      throw new HttpException(
        {
          message: 'Confirmation error',
          field: 'email',
        },
        HttpStatus.BAD_REQUEST,
      );

    return value;
  }
}
