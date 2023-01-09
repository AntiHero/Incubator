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

    if (!refreshToken)
      throw new HttpException('Not authorized', HttpStatus.UNAUTHORIZED);

    try {
      const decodedToken = jwt.verify(
        refreshToken,
        process.env.SECRET ?? 'simple_secret',
      ) as jwt.JwtPayload;

      const { id, expDate, deviceId } = decodedToken.id;

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
