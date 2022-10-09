import { body } from 'express-validator';
import { Request, Response } from 'express';

import User from '@/models/User';
import { UserFields } from '@/enums';
import { APIErrorResult } from '@/@types';
import * as ErrorMessages from '@/errorMessages';
import * as usersRepository from '@/repository/users.repository';
import { validateObjectId } from '@/customValidators/objectIdValidator';
import { checkAuthorization } from '@/customValidators/basicAuthValidator';
import { customValidationResult } from '@/customValidators/customValidationResults';
import { convertToUser } from '@/utils/convertToUser';

const MIN_PASSWORD_LEN = 6;
const MAX_PASSWORD_LEN = 20;

const MIN_LOGIN_LEN = 3;
const MAX_LOGIN_LEN = 10;

export const createUser = [
  ...checkAuthorization,
  validateObjectId,
  body(UserFields.login)
    .isString()
    .withMessage(ErrorMessages.NOT_STRING_ERROR)
    .trim()
    .isLength({ max: MAX_LOGIN_LEN })
    .withMessage(ErrorMessages.MAX_LENGTH_ERROR)
    .isLength({ min: MIN_LOGIN_LEN })
    .withMessage(ErrorMessages.MIN_LENGTH_ERROR),
  body(UserFields.password)
    .isString()
    .withMessage(ErrorMessages.NOT_STRING_ERROR)
    .trim()
    .isLength({ max: MAX_PASSWORD_LEN })
    .withMessage(ErrorMessages.MAX_LENGTH_ERROR)
    .isLength({ min: MIN_PASSWORD_LEN })
    .withMessage(ErrorMessages.MIN_LENGTH_ERROR),
  body(UserFields.email)
    .isString()
    .withMessage(ErrorMessages.NOT_STRING_ERROR)
    .trim()
    .matches(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)
    .withMessage(ErrorMessages.WRONG_PATTERN_ERROR),
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

    res.type('text/plain').status(201).json(convertToUser(user));
  },
];
