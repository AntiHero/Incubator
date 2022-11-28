import { Observable } from 'rxjs';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import jwt from 'jsonwebtoken';

const AUTHENTICATION_SCHEME = 'Bearer';

@Injectable()
export class BearerAuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    const authHeader = request.get('authorization');

    if (!authHeader) {
      throw new HttpException('Unauthorized3', HttpStatus.UNAUTHORIZED);
    }

    const [scheme, token] = authHeader.split(/\s+/);

    if (scheme !== AUTHENTICATION_SCHEME) {
      throw new HttpException(
        'Invalid authentication scheme',
        HttpStatus.UNAUTHORIZED,
      );
    }

    try {
      const decodedToken = jwt.verify(
        token,
        process.env.SECRET ?? 'simple_secret',
      ) as jwt.JwtPayload;

      const id = decodedToken.id;
      const username = decodedToken.username;

      if (!id) {
        throw new Error('Invalid token');
      } else {
        request.userId = id;
        request.login = username;
      }
    } catch (e) {
      throw new HttpException('Unauthorized4', HttpStatus.UNAUTHORIZED);
    }

    return true;
  }
}
