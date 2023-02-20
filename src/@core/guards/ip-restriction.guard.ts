import { Observable } from 'rxjs';

import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request } from 'express';

import { MAX_TIMEOUT, RATE_LIMIT } from 'root/@core/constants';

type ReqInfo = { ip: string; path: string; time: number };
type RequestHistory = ReqInfo[];

const history: RequestHistory = [];

@Injectable()
export class IpRestrictionGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest() as Request;
    const ip = req.ip;
    const path = req.path;

    const now = Date.now();

    const reqsInLastTenSeconds = history.filter(
      (r) => now - r.time < MAX_TIMEOUT && r.ip === ip && r.path === path,
    );

    if (reqsInLastTenSeconds.length >= RATE_LIMIT) {
      throw new HttpException(
        'Too many requests',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    history.push({ ip, path, time: now });

    return true;
  }
}
