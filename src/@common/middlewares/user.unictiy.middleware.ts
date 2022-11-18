import { FastifyReply, FastifyRequest } from 'fastify';
import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';

import { UserInputModel } from 'root/users/types';
import { UsersService } from 'root/users/users.service';

@Injectable()
export class UserUnicityMiddleware implements NestMiddleware {
  constructor(private readonly usersService: UsersService) {}
  async use(
    req: FastifyRequest,
    res: FastifyReply,
    next: (error?: any) => void,
  ) {
    const { login, email } = req.body as UserInputModel;

    const user = await this.usersService.findUserByLoginOrEmail(login, email);

    if (user)
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);

    next();
  }
}
