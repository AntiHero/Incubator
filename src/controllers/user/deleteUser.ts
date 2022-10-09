import { Request, Response } from 'express';

import * as usersService from '@/domain/users.service';
import { validateObjectId } from '@/customValidators/objectIdValidator';
import { checkAuthorization } from '@/customValidators/basicAuthValidator';

export const deleteUser = [
  ...checkAuthorization,
  validateObjectId,
  async (req: Request, res: Response) => {
    const result = await usersService.deleteUser(req.params.id);

    if (result === null) {
      return res.sendStatus(404);
    }

    res.status(204).end();
  },
];
