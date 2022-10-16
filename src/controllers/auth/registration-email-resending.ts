import { body } from 'express-validator';
import { Request, Response } from 'express';

import { UserFields } from '@/enums';
import { APIErrorResult } from '@/@types';
import { fiveMinInMs } from '@/constants';
import * as ErrorMessages from '@/errorMessages';
import { convertToUser } from '@/utils/convertToUser';
import * as UsersService from '@/domain/users.service';
import * as EmailManager from '@/managers/emailManager';
import * as UsersRepository from '@/repository/users.repository';
import { customValidationResult } from '@/customValidators/customValidationResults';
import { validateConfirmationStatus } from '@/customValidators/validateConfirmationStatus';

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

    const user = await UsersRepository.findUserByLoginOrEmail(email);

    if (!user) return res.sendStatus(404);

    const userId = convertToUser(user).id;

    await UsersService.updateUser(userId, {
      'confirmationInfo.expDate': Date.now() + fiveMinInMs,
    });

    await EmailManager.sendConfirmationEmail({
      to: email as string,
      code: user.confirmationInfo.code,
    });

    res.sendStatus(204);
  },
];
