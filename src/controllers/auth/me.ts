import { Request, Response } from 'express';

import { User } from '@/@types';
import { convertToUser } from '@/utils/convertToUser';
import * as usersService from '@/domain/users.service';
import { checkAuthorization } from '@/customValidators/bearerAuthValidator';

export const me = [
  ...checkAuthorization,
  async (req: Request, res: Response) => {
    const userId = req.userId;

    const doc = (await usersService.getUser(userId)) as User;

    const user = convertToUser(doc);

    res.status(200).type('text/plain').json(user);
  },
];
