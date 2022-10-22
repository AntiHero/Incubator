import { Request, Response } from 'express';

import SecurityService from '@/domain/security.service';
import { validateRefreshToken } from '@/customValidators/refreshTokenValidator';
import { customValidationResult } from '@/customValidators/customValidationResults';

export const deleteAllDevices = [
  validateRefreshToken,
  async (req: Request, res: Response) => {
    if (!customValidationResult(req).isEmpty()) return res.sendStatus(401);

    await SecurityService.terminateAllSessionsButOne({
      deviceId: req.deviceId,
    });

    res.sendStatus(204);
  },
];
