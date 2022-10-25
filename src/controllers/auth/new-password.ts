import { body } from 'express-validator';
import { Request, Response } from 'express';

import * as constants from '@/constants';
import { NewPasswordRequest } from '@/enums';
import { rateLimit } from '@/utils/rateLimit';
import * as ErrorMessages from '@/errorMessages';
import * as UsersService from '@/app/users.service';
import { APIErrorResult, IpsType } from '@/@types';
import { validateRecoveryCode } from '@/customValidators/recoveryCodeValidator';
import { customValidationResult } from '@/customValidators/customValidationResults';

const ips: IpsType = {};

const MIN_PASSWORD_LEN = 6;
const MAX_PASSWORD_LEN = 20;

export const newPassword = [
  body(NewPasswordRequest.newPassword)
    .isString()
    .withMessage(ErrorMessages.NOT_STRING_ERROR)
    .trim()
    .isLength({ max: MAX_PASSWORD_LEN })
    .withMessage(ErrorMessages.MAX_LENGTH_ERROR(MAX_PASSWORD_LEN))
    .isLength({ min: MIN_PASSWORD_LEN })
    .withMessage(ErrorMessages.MIN_LENGTH_ERROR(MIN_PASSWORD_LEN)),
  body(NewPasswordRequest.recoveryCode)
    .isString()
    .withMessage(ErrorMessages.NOT_STRING_ERROR)
    .trim()
    .custom(validateRecoveryCode),
  async (req: Request, res: Response) => {
    try {
      const ip = req.ip;

      rateLimit(ips, ip, constants.RATE_LIMIT, constants.MAX_TIMEOUT);
    } catch (e) {
      return res.sendStatus(429);
    }

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

    const userId = req.userId;
    const newPassword = req.body[NewPasswordRequest.newPassword];

    await UsersService.updateUser(userId, { password: newPassword });

    res.sendStatus(204);
  },
];
