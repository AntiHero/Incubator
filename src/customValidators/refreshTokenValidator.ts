import jwt from 'jsonwebtoken';
import { cookie } from 'express-validator';

export const validateRefreshToken = cookie('refreshToken').custom(
  (token, { req }) => {
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
