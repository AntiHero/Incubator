import { body } from 'express-validator';
import { Request, Response } from 'express';

import * as constants from '@/constants';
import { ConfirmationRequest } from '@/enums';
import { rateLimit } from '@/utils/rateLimit';
import * as ErrorMessages from '@/errorMessages';
import * as UsersService from '@/app/users.service';
import { APIErrorResult, h05, IpsType } from '@/@types';
import { validateConfirmation } from '@/customValidators/confirmationValidator';
import { customValidationResult } from '@/customValidators/customValidationResults';

const ips: IpsType = {};

export const registrationConfirmation = [
  body(ConfirmationRequest.code)
    .isString()
    .withMessage(ErrorMessages.NOT_STRING_ERROR)
    .trim()
    .custom(validateConfirmation),
  async (req: Request, res: Response) => {
    if (!customValidationResult(req).isEmpty()) {
      try {
        const ip = req.ip;

        rateLimit(ips, ip, constants.RATE_LIMIT, constants.MAX_TIMEOUT);

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
      } catch (e) {
        return res.sendStatus(429);
      }
    }

    const user = (await UsersService.findUserByConfirmationCode(
      req.body.code
    )) as h05.UserViewModel;

    await UsersService.confirmUser(user.id);

    res.sendStatus(204);
  },
];
