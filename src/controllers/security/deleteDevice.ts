import { Request, Response } from 'express';

import SecurityService from '@/domain/security.service';
import { validateRefreshToken } from '@/customValidators/refreshTokenValidator';
import { customValidationResult } from '@/customValidators/customValidationResults';

export const deleteDevice = [
  validateRefreshToken,
  async (req: Request, res: Response) => {
    if (!customValidationResult(req).isEmpty()) return res.sendStatus(401);

    await SecurityService.terminateAllSessions();

    res.sendStatus(204);
  },
];
