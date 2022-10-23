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
    deviceId: '7e80e8fb-68df-4606-831e-75015ecb4754',
    ip: '3.73.132.52',
    lastActiveDate: '2022-10-23T13:19:51.894Z',
    title:
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36',
  },
  {
    deviceId: '36fe9f3c-260f-471e-86d8-6ffb11349d1a',
    ip: '3.73.132.52',
    lastActiveDate: '2022-10-23T13:19:44.249Z',
    title:
      'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:105.0) Gecko/20100101 Firefox/103.0',
  },
  {
    deviceId: '01a0ddbf-49bc-44c6-a0bc-6dfc9ba910cc',
    ip: '3.73.132.52',
    lastActiveDate: '2022-10-23T13:19:44.832Z',
    title:
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36',
  },
  {
    deviceId: 'a2d47e17-526a-4f0d-8108-079a0ce5bd92',
    ip: '3.73.132.52',
    lastActiveDate: '2022-10-23T13:19:45.416Z',
    title:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 12_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.6 Safari/605.1.15',
  },
  {
    deviceId: '13134f46-8433-47e2-aba2-ece72adf01fa',
    ip: '3.73.132.52',
    lastActiveDate: '2022-10-23T13:19:49.536Z',
    title:
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36',
  },
];
