import { body } from 'express-validator';
import { Request, Response } from 'express';

import { UserFields } from '@/enums';
import { APIErrorResult } from '@/@types';
import * as ErrorMessages from '@/errorMessages';
import { convertToUser } from '@/utils/convertToUser';
import * as UsersService from '@/domain/users.service';
import { customValidationResult } from '@/customValidators/customValidationResults';
import { validateConfirmationStatus } from '@/customValidators/confirmationStatusValidator';

export const registrationEmailResending = [
  body(UserFields.email)
    .isEmail()
    .withMessage(ErrorMessages.NOT_EMAIL)
    .trim()
    .custom(validateConfirmationStatus),
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

    const { email }: { email: string } = req.body;

    const user = await UsersService.findUserByLoginOrEmail(email);

    if (!user) return res.sendStatus(404);

    const userId = convertToUser(user).id;

    await UsersService.resendConfirmationEmail(userId, email);

    res.sendStatus(204);
  },
];
