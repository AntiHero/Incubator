import { body } from 'express-validator';
import { Request, Response } from 'express';

import { UserFields } from '@/enums';
import { APIErrorResult, h06 } from '@/@types';
import * as ErrorMessages from '@/errorMessages';
import * as usersService from '@/domain/users.service';
import { customValidationResult } from '@/customValidators/customValidationResults';

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
    const userAuthResult = await usersService.authenticateUser({
      login,
      password,
    });

    console.log(userAuthResult);
    if (!userAuthResult) return res.sendStatus(401);

    const [token, refreshToken] = userAuthResult;

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

    const payload: h06.LoginSuccessViewModel = { accessToken: token };

    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true });
    res.status(200).json(payload);
  },
];
