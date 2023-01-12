import { Observable } from 'rxjs';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request } from 'express';

import { MAX_TIMEOUT, RATE_LIMIT } from 'root/@common/constants';
import { HTTPMethods } from 'fastify';

type ReqHistory = {
  [key in HTTPMethods]?: {
    [key: string]: { [key: string]: InitState };
  };
};

type InitState = {
  count: number;
  time: number;
};

const reqHistory: ReqHistory = {};

@Injectable()
export class IpRestrictionGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest() as Request;
    const ip = req.ip;
    const endpoint = req.url;
    const method = req.method as HTTPMethods;

    const initState: InitState = {
      count: 0,
      time: Date.now(),
    };

    const methodObj = reqHistory[method] ?? { [endpoint]: { [ip]: initState } };

    reqHistory[method] = methodObj;

    const endpointObj = methodObj[endpoint] ?? { [ip]: initState };

    methodObj[endpoint] = endpointObj;

    const ipObj = endpointObj[ip];

    ipObj.count++;

    if (ipObj.count > RATE_LIMIT) {
      if (Date.now() - ipObj.time < MAX_TIMEOUT) {
        throw new HttpException(
          'Too many requests',
          HttpStatus.TOO_MANY_REQUESTS,
        );
      } else {
        reqHistory[method][endpoint][ip] = initState;
      }
    }

    return true;
  }
}
