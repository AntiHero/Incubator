import { v4 as uuid } from 'uuid';
import { body } from 'express-validator';
import { Request, Response } from 'express';

import { UserFields } from '@/enums';
import * as ErrorMessages from '@/errorMessages';
import * as UsersService from '@/domain/users.service';
import SecurityService from '@/domain/security.service';
import {
  APIErrorResult,
  h06,
  SecuirityDeviceInput,
  UserForToken,
} from '@/@types';
import { customValidationResult } from '@/customValidators/customValidationResults';
import { convertToUser } from '@/utils/convertToUser';

const MAX_PASSWORD_LEN = 20;
const MIN_LOGIN_LEN = 3;
const MAX_LOGIN_LEN = 10;
const MIN_PASSWORD_LEN = 6;

export const login = [
  body(UserFields.login)
    .isString()
    .withMessage(ErrorMessages.NOT_STRING_ERROR)
    .trim()
    .isLength({ max: MAX_LOGIN_LEN })
    .withMessage(ErrorMessages.MAX_LENGTH_ERROR(MAX_LOGIN_LEN))
    .isLength({ min: MIN_LOGIN_LEN })
    .withMessage(ErrorMessages.MIN_LENGTH_ERROR(MIN_LOGIN_LEN)),
  body(UserFields.password)
    .isString()
    .withMessage(ErrorMessages.NOT_STRING_ERROR)
    .trim()
    .isLength({ max: MAX_PASSWORD_LEN })
    .withMessage(ErrorMessages.MAX_LENGTH_ERROR(MAX_PASSWORD_LEN))
    .isLength({ min: MIN_PASSWORD_LEN })
    .withMessage(ErrorMessages.MIN_LENGTH_ERROR(MIN_PASSWORD_LEN)),
  async (req: Request, res: Response) => {
    const { login, password } = req.body;

    const dbUser = await UsersService.authenticateUser({
      login,
      password,
    });

    if (!dbUser) return res.sendStatus(401);

    const userId = convertToUser(dbUser).id;

    console.log(login, password, userId, 'userId');

    if (!customValidationResult(req).isEmpty()) {
      res
        .type('text/plain')
        .status(400)
        .send(
          JSON.stringify({
            errorsMessages: customValidationResult(req).array({
              onlyFirstError: true,
            }),
          } as APIErrorResult)
        );

      return;
    }

    const newDeviceId = uuid();

    const ip = req.ip;
    const userAgent = req.headers['user-agent'];
    console.log(ip, userAgent);

    const newDevice: SecuirityDeviceInput = {
      ip,
      deviceId: newDeviceId,
      lastActiveDate: new Date(),
      title: userAgent || 'unknown',
      userId,
    };

    const existingDeviceId = await SecurityService.createDeviceIfNotExists(
      newDevice
    );

    const userForToken: UserForToken = {
      login,
      userId,
      deviceId: existingDeviceId ?? newDeviceId,
    };

    console.log(userForToken.deviceId, 'deviceId');

    const [token, refreshToken] = await UsersService.createTokensPair(
      userForToken
    );

    const payload: h06.LoginSuccessViewModel = { accessToken: token };

    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true });
    res.status(200).json(payload);
  },
];
[
  {
    deviceId: 'bf97b56b-1dba-45fc-a305-41db7f9a4ee9',
    ip: '3.73.132.52',
    lastActiveDate: '2022-10-23T09:55:14.904Z',
    title:
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36',
  },
  {
    deviceId: '38fb6f45-f283-4fea-bdac-b9292a3f0794',
    ip: '3.73.132.52',
    lastActiveDate: '2022-10-23T09:55:06.775Z',
    title:
      'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:105.0) Gecko/20100101 Firefox/103.0',
  },
  {
    deviceId: 'b1f1be14-9cae-4975-a400-0d692d46e1d0',
    ip: '3.73.132.52',
    lastActiveDate: '2022-10-23T09:55:07.378Z',
    title:
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36',
  },
  {
    deviceId: 'ceb1c61e-ed64-49bc-a95c-625ce0ef69c9',
    ip: '3.73.132.52',
    lastActiveDate: '2022-10-23T09:55:07.965Z',
    title:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 12_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.6 Safari/605.1.15',
  },
  {
    deviceId: 'e7202e84-efd2-4d91-9e36-2ddb09c9b624',
    ip: '3.73.132.52',
    lastActiveDate: '2022-10-23T09:55:12.071Z',
    title:
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36',
  },
];
