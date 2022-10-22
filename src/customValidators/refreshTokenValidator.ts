import jwt from 'jsonwebtoken';
import { cookie } from 'express-validator';
import * as tokensBlackListRepository from '@/repository/tokensBlackList.repository';

export const validateRefreshToken = cookie('refreshToken').custom(
  async (token, { req }) => {
    try {
      const decodedToken = jwt.verify(
        token,
        process.env.SECRET ?? 'simple_secret'
      ) as jwt.JwtPayload;

      const id = decodedToken.id;
      const exp = decodedToken.exp;
      const deviceId = decodedToken.deviceId;

      const blackListedToken = await tokensBlackListRepository.findTokenByValue(
        token
      );

      if (!id || blackListedToken) {
        throw new Error('Invalid token');
      } else {
        req.userId = id;
        req.deviceId = deviceId;
        req.refreshTokenExp = exp;
      }
    } catch (e) {
      console.log('ошибка');
      throw new Error('Invalid token');
    }

    return true;
  }
);
