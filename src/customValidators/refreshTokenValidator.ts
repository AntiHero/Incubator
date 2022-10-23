import jwt from 'jsonwebtoken';
import { cookie } from 'express-validator';
import securityDevicesRepository from '@/repository/security.repository';
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
      
      const isInSession = await securityDevicesRepository.findOneByQuery({ deviceId });

      if (!id || !isInSession || blackListedToken) {
        throw new Error('Invalid token');
      } else {
        req.userId = id;
        req.deviceId = deviceId;
        req.refreshTokenExp = exp;
      }
    } catch (e) {
      throw new Error('Invalid token');
    }

    return true;
  }
);
