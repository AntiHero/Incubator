import { Observable } from 'rxjs';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import { IpsType } from '../types';
import { rateLimit } from '../utils/rate-limit';
import { MAX_TIMEOUT, RATE_LIMIT } from 'root/@common/constants';

const ips: IpsType = {};

@Injectable()
export class IpRestrictionGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const ip = request.ip;
    const url = request.url;

    try {
      rateLimit(ips, url, ip, RATE_LIMIT, MAX_TIMEOUT);
    } catch (e) {
      throw new HttpException(
        'Too many requests',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    return true;
  }
}
