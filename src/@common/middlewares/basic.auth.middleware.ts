import { Request, Response, NextFunction } from 'express';
import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';

import { UsersService } from 'root/users/users.service';
const AUTHENTICATION_SCHEME = 'Basic';
const LOGIN = 'admin';
const PASSWORD = 'qwerty';

@Injectable()
export class BasicAuthMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.get('Authorization');

    const [scheme, encodedLoginPassword] = authHeader.split(/\s+/);

    if (scheme !== AUTHENTICATION_SCHEME) {
      throw new Error('Invalid authentication scheme');
    }

    const decodedLoginPassowrd = Buffer.from(
      encodedLoginPassword,
      'base64',
    ).toString();

    if (decodedLoginPassowrd !== [LOGIN, PASSWORD].join(':')) {
      throw new HttpException(
        'Incorrect login/password pair',
        HttpStatus.UNAUTHORIZED,
      );
    }

    next();
  }
}
