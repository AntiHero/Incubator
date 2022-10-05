import { NextFunction, Response, Request } from 'express';
import { header } from 'express-validator';

import { Headers } from '@/fields';
import { customValidationResult } from './customValidationResults';

const AUTHENTICATION_SCHEME = 'Basic';

const login = 'admin';
const password = 'qwerty';

export const checkAuthorization = [
  header(Headers.Authorization).custom((value: string) => {
    const [scheme, encodedLoginPassword] = value.split(/\s+/);

    if (scheme !== AUTHENTICATION_SCHEME) {
      throw new Error('Invalid authentication scheme');
    }

    const decodedLoginPassowrd = Buffer.from(
      encodedLoginPassword,
      'base64'
    ).toString();

    if (decodedLoginPassowrd !== [login, password].join(':')) {
      throw new Error('Incorrect login/password pair');
    }

    return true;
  }),
  (req: Request, res: Response, next: NextFunction) => {
    if (!customValidationResult(req).isEmpty()) {
      res.status(401).end();

      return;
    }

    next();
  },
];
