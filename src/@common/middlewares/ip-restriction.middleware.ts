import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

import { IpsType } from '../types';
import { rateLimit } from '../utils/rateLimit';
import { MAX_TIMEOUT, RATE_LIMIT } from '../constants';

const ips: IpsType = {};

@Injectable()
export class IpRestrictionMiddleware implements NestMiddleware {
  async use(req: Request, _res: Response, next: NextFunction) {
    const ip = req.ip;
    const url = req.url;

    console.log('incoming requtest', ip, url);

    try {
      rateLimit(ips, url, ip, RATE_LIMIT, MAX_TIMEOUT);
    } catch (e) {
      console.log('limit exceeded');
      throw new HttpException(
        'Too many requests',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    next();
  }
}
