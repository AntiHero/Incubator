import { body } from 'express-validator';
import { Request, Response } from 'express';

import { ConfirmationRequest } from '@/enums';
import { APIErrorResult, h05 } from '@/@types';
import * as ErrorMessages from '@/errorMessages';
import * as UsersService from '@/domain/users.service';
import { validateConfirmation } from '@/customValidators/validateConfirmation';
import { customValidationResult } from '@/customValidators/customValidationResults';

export const registrationConfirmation = [
  body(ConfirmationRequest.code)
    .isString()
    .withMessage(ErrorMessages.NOT_STRING_ERROR)
    .trim()
    .custom(validateConfirmation),
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

    const user = (await UsersService.findUserByConfirmationCode(
      req.body.code
    )) as h05.UserViewModel;

    await UsersService.confirmUser(user.id);

    res.sendStatus(204);
  },
];
