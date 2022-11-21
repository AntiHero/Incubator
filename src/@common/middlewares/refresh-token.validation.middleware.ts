import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { TokensService } from 'root/tokens/tokens.service';

@Injectable()
export class RefreshTokenValidationMiddleware implements NestMiddleware {
  constructor(private readonly tokensService: TokensService) {}
  async use(req: Request, _res: Response, next: NextFunction) {
    const { refreshToken } = req.cookies;
    console.log(refreshToken, 'rt');

    if (!refreshToken)
      throw new HttpException('Not authorized', HttpStatus.UNAUTHORIZED);

    try {
      const decodedToken = jwt.verify(
        refreshToken,
        process.env.SECRET ?? 'simple_secret',
      ) as jwt.JwtPayload;

      const id = decodedToken.id;
      const expDate = decodedToken.exp;
      const deviceId = decodedToken.deviceId;

      const blackListedToken = await this.tokensService.findTokenByQuery({
        token: refreshToken,
        blackListed: true,
      });

      if (!id || blackListedToken) {
        throw new HttpException('Not authorized', HttpStatus.UNAUTHORIZED);
      } else {
        req.userId = id;
        req.expDate = expDate;
        req.deviceId = deviceId;
      }
    } catch (e) {
      console.log(e);
      throw new HttpException('Not authorized', HttpStatus.UNAUTHORIZED);
    }

    next();
  }
}

[
  {
    deviceId: '7b9facbf-9ee6-4f39-8b8b-d3b7f3d62097',
    ip: '10.1.41.24',
    lastActiveDate: '2022-11-21T20:44:50.498Z',
    title:
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36',
  },
  {
    deviceId: '7b9facbf-9ee6-4f39-8b8b-d3b7f3d62097',
    ip: '10.1.52.197',
    lastActiveDate: '2022-11-21T20:44:50.498Z',
    title:
      'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:105.0) Gecko/20100101 Firefox/103.0',
  },
  {
    deviceId: '7b9facbf-9ee6-4f39-8b8b-d3b7f3d62097',
    ip: '10.1.43.219',
    lastActiveDate: '2022-11-21T20:44:50.498Z',
    title:
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36',
  },
  {
    deviceId: '7b9facbf-9ee6-4f39-8b8b-d3b7f3d62097',
    ip: '10.1.48.173',
    lastActiveDate: '2022-11-21T20:44:50.498Z',
    title:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 12_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.6 Safari/605.1.15',
  },
];
