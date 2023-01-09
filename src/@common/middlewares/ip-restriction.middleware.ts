import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

import { reqLimiter } from '../utils/request-limiter';
import { MAX_TIMEOUT, RATE_LIMIT } from '../constants';

@Injectable()
export class IpRestrictionMiddleware implements NestMiddleware {
  async use(req: Request, _res: Response, next: NextFunction) {
    const ip = req.ip;
    const endpoint = req.url;

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

    next();
  }
}
