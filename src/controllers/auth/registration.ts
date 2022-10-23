import { body } from 'express-validator';
import { Request, Response } from 'express';

import User from '@/models/User';
import { UserFields } from '@/enums';
import * as constants from '@/constants';
import { APIErrorResult } from '@/@types';
import { rateLimit } from '@/utils/rateLimit';
import * as ErrorMessages from '@/errorMessages';
import * as EmailManager from '@/managers/emailManager';
import * as usersRepository from '@/repository/users.repository';
import { validateUserUnicity } from '@/customValidators/uniqueUserValidator';
import { customValidationResult } from '@/customValidators/customValidationResults';

const MIN_PASSWORD_LEN = 6;
const MAX_PASSWORD_LEN = 20;

const MIN_LOGIN_LEN = 3;
const MAX_LOGIN_LEN = 10;

const ips: IpsType = {};

export const registration = [
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
  body(UserFields.email)
    .isString()
    .withMessage(ErrorMessages.NOT_STRING_ERROR)
    .trim()
    .matches(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)
    .withMessage(ErrorMessages.WRONG_PATTERN_ERROR),
  validateUserUnicity,
  async (req: Request, res: Response) => {
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
      
    const { login, email, password } = req.body;

    const userData = new User(login, email, password);
    const user = await usersRepository.createUser(userData);

    await EmailManager.sendConfirmationEmail({
      to: email as string,
      code: user.confirmationInfo.code,
    });

    const ip = req.ip;

    try {
      rateLimit(ips, ip, constants.RATE_LIMIT, constants.MAX_TIMEOUT);

      res.sendStatus(204);
    } catch (e) {
      res.sendStatus(429);
    }
  },
];
