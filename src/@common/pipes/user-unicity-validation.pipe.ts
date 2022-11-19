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

    const userByLogin = await this.usersService.findUserByLoginOrEmail(login);
    const userByEmail = await this.usersService.findUserByLoginOrEmail(email);

    if (userByLogin || userByEmail)
      throw new HttpException(
        {
          message: 'User already exists',
          filed: userByLogin ? 'login' : 'email',
        },
        HttpStatus.BAD_REQUEST,
      );

    return value;
  }
}
