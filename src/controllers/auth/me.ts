import { Request, Response } from 'express';

import * as usersService from '@/domain/users.service';
import { checkAuthorization } from '@/customValidators/bearerAuthValidator';
import { convertToUser } from '@/utils/convertToUser';

export const me = [
  ...checkAuthorization,
  async (req: Request, res: Response) => {
    const userId = req.params.id;

    const doc = await usersService.getUser(userId);

    if (doc) {
      const user = convertToUser(doc);
      res.status(200).type('text/plain').json(user);
    }
  },
];
