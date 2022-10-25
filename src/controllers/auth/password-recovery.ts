import { body } from 'express-validator';
import { Request, Response } from 'express';

import * as constants from '@/constants';
import * as errors from '@/errorMessages';
import { rateLimit } from '@/utils/rateLimit';
import { APIErrorResult, IpsType } from '@/@types';
import * as UsersService from '@/app/users.service';
import { convertToUser } from '@/utils/convertToUser';
import { customValidationResult } from '@/customValidators/customValidationResults';

const ips: IpsType = {};
 
export const passwordRecovery = [
  body('email')
    .matches(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)
    .withMessage(errors.WRONG_PATTERN_ERROR),
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
    
    const ip = req.ip;

    try {
      rateLimit(ips, ip, constants.RATE_LIMIT, constants.MAX_TIMEOUT);
    } catch (e) {
      return res.sendStatus(429);
    }

    const email: string = req.body.email;

    const dbUser = await UsersService.findUserByLoginOrEmail(email);

    if (dbUser) {
      const { id, email } = convertToUser(dbUser);
      await UsersService.sendRecoveryEmail(id, email);
    }

    res.sendStatus(204);
  },
];
