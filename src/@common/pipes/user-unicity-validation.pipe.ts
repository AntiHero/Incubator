import {
  ArgumentMetadata,
  HttpException,
  HttpStatus,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

import { UserInputModel } from 'root/users/types';
import { UsersService } from 'root/users/users.service';

@Injectable()
export class UserUnicityValidationPipe implements PipeTransform {
  constructor(private readonly usersService: UsersService) {}

  async transform(value: UserInputModel, metadata: ArgumentMetadata) {
    if (metadata.type !== 'body') return value;

    const { login, email } = value;

    const user = await this.usersService.findUserByLoginOrEmail(login, email);

    if (user)
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);

    return value;
  }
}
