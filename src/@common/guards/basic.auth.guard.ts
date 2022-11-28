import { Observable } from 'rxjs';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

const AUTHENTICATION_SCHEME = 'Basic';
const LOGIN = 'admin';
const PASSWORD = 'qwerty';

@Injectable()
export class BasicAuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    const authHeader = request.get('authorization');
    console.log(authHeader, 'authHeader');

    if (!authHeader) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    const [scheme, encodedLoginPassword] = authHeader.split(/\s+/);

    const decodedLoginPassowrd = Buffer.from(
      encodedLoginPassword,
      'base64',
    ).toString();

    if (
      scheme !== AUTHENTICATION_SCHEME ||
      decodedLoginPassowrd !== [LOGIN, PASSWORD].join(':')
    ) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    return true;
  }
}
