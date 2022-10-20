import { Request, Response } from 'express';

import { h06, User } from '@/@types';
import { convertToUser } from '@/utils/convertToUser';
import * as usersService from '@/domain/users.service';
import { checkAuthorization } from '@/customValidators/bearerAuthValidator';

export const me = [
  ...checkAuthorization,
  async (req: Request, res: Response) => {
    const userId = req.userId;

    const doc = (await usersService.getUser(userId)) as User;

    const user = convertToUser(doc);
    const userView: h06.MeViewModel = {
      email: user.email,
      login: user.login,
      userId: user.id,
    };

    res.status(200).type('text/plain').json(userView);
  },
];
