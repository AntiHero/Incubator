import { Observable } from 'rxjs';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import { reqLimiter } from '../utils/request-limiter';
import { MAX_TIMEOUT, RATE_LIMIT } from 'root/@common/constants';

@Injectable()
export class IpRestrictionGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const ip = request.ip;
    const endpoint = request.url;

    const isLimitExceeded = reqLimiter(endpoint, ip, {
      limit: RATE_LIMIT,
      timeout: MAX_TIMEOUT,
    });

    if (isLimitExceeded) {
      throw new HttpException(
        'Too many requests',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    return true;
  }
}
