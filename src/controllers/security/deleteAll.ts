import { Request, Response } from 'express';

import { validateRefreshToken } from '@/customValidators/refreshTokenValidator';
import { customValidationResult } from '@/customValidators/customValidationResults';

export const deleteAllDevices = [
  validateRefreshToken,
  async (req: Request, res: Response) => {
    if (!customValidationResult(req).isEmpty()) return res.sendStatus(401);

    res.sendStatus(204);
  },
];
