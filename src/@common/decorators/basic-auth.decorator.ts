import {
  createParamDecorator,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

const AUTHENTICATION_SCHEME = 'Basic';
const LOGIN = 'admin';
const PASSWORD = 'qwerty';

export const ApiBasicAuth = createParamDecorator(
  (data, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    const authHeader = request.get('authorization');

    if (!authHeader) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    const [scheme, encodedLoginPassword] = authHeader.split(/\s+/);

    if (scheme !== AUTHENTICATION_SCHEME) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

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
  },
);
