import { body } from 'express-validator';
import { Request, Response } from 'express';

import { ConfirmationRequest } from '@/enums';
import { APIErrorResult } from '@/@types';
import * as ErrorMessages from '@/errorMessages';
import * as UsersService from '@/domain/users.service';
import { customValidationResult } from '@/customValidators/customValidationResults';
import { validateConfirmationCode } from '@/customValidators/validateConfirmationCode';

export const registrationConfirmation = [
  body(ConfirmationRequest.code)
    .isString()
    .withMessage(ErrorMessages.NOT_STRING_ERROR)
    .trim()
    .custom(validateConfirmationCode),
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

    const { code }: { code: string } = req.body;

    const confirmation = await UsersService.checkUsersConfirmationCode(code);

    if (!confirmation) {
      return res.sendStatus(404);
    }

    await UsersService.confirmUser(confirmation);
    res.sendStatus(204);
  },
];
