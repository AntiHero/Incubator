import jwt from 'jsonwebtoken';
import { header } from 'express-validator';

import { Headers } from '@/enums';

const AUTHENTICATION_SCHEME = 'Bearer';

export const checkJWTAuth = header(Headers.Authorization).custom(
  (value: string, { req }) => {
    const [scheme, token] = value.split(/\s+/);

    if (scheme !== AUTHENTICATION_SCHEME) {
      throw new Error('Invalid authentication scheme');
    }

    try {
      const decodedToken = jwt.verify(
        token,
        process.env.SECRET ?? 'simple_secret'
      ) as jwt.JwtPayload;

      const id = decodedToken.id;

      if (!id) {
        throw new Error('Invalid token');
      } else {
        req.userId = id;
      }
    } catch (e) {
      throw new Error('Invalid token');
    }

    return true;
  }
);
