import { Request, Response } from 'express';

import SecurityService from '@/domain/security.service';
import { validateRefreshToken } from '@/customValidators/refreshTokenValidator';
import { customValidationResult } from '@/customValidators/customValidationResults';

export const deleteDevice = [
  validateRefreshToken,
  async (req: Request, res: Response) => {
    if (!customValidationResult(req).isEmpty()) return res.sendStatus(401);

    const device = await SecurityService.getDevice({ deviceId: req.params.id });

    if (!device) return res.sendStatus(404);
    
    if (device.userId.toString() !== req.userId) return res.sendStatus(403);

    res.sendStatus(204);
  },
];
