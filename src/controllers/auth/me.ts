import { Request, Response } from 'express';

import { h06, UserDBType } from '@/@types';
import { convertToUser } from '@/utils/convertToUser';
import * as usersService from '@/app/users.service';
import { checkAuthorization } from '@/customValidators/bearerAuthValidator';

export const me = [
  ...checkAuthorization,
  async (req: Request, res: Response) => {
    const userId = req.userId;

    const doc = (await usersService.getUser(userId)) as UserDBType;

    const user = convertToUser(doc);
    const userView: h06.MeViewModel = {
      email: user.email,
      login: user.login,
      userId: user.id,
    };

    res.status(200).type('text/plain').json(userView);
  },
];
