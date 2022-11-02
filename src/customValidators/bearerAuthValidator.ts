// import jwt from 'jsonwebtoken';
// import { header } from 'express-validator';
import { NextFunction, Response, Request } from 'express';

// import { Headers } from '@/enums';
import { checkJWTAuth } from '@/middlewares/userAuthWithToken';
import { customValidationResult } from './customValidationResults';

// const AUTHENTICATION_SCHEME = 'Bearer';

export const checkAuthorization = [
  checkJWTAuth,
  // header(Headers.Authorization).custom((value: string, { req }) => {
  //   const [scheme, token] = value.split(/\s+/);

  //   if (scheme !== AUTHENTICATION_SCHEME) {
  //     throw new Error('Invalid authentication scheme');
  //   }

  //   try {
  //     const decodedToken = jwt.verify(
  //       token,
  //       process.env.SECRET ?? 'simple_secret'
  //     ) as jwt.JwtPayload;

  //     const id = decodedToken.id;

  //     if (!id) {
  //       throw new Error('Invalid token');
  //     } else {
  //       req.userId = id;
  //     }
  //   } catch (e) {
  //     throw new Error('Invalid token');
  //   }

  //   return true;
  // }),
  (req: Request, res: Response, next: NextFunction) => {
    if (!customValidationResult(req).isEmpty()) {
      res.status(401).end();

      return;
    }

    next();
  },
];
