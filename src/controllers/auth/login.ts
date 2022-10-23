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

