import { Request, Response } from 'express';

import SecurityService from '@/domain/security.service';
import { validateRefreshToken } from '@/customValidators/refreshTokenValidator';
import { customValidationResult } from '@/customValidators/customValidationResults';

export const deleteDevice = [
  validateRefreshToken,
  async (req: Request, res: Response) => {
    if (!customValidationResult(req).isEmpty()) return res.sendStatus(401);

    console.log('--------DELETE /security/devices/id---------');
    console.log(req.deviceId, 'deviceId from token', req.params.id, 'device id from params', req.userId, 'userId');
    const deviceId = req.params.id;

    const device = await SecurityService.getDevice({ deviceId });

    if (!device) return res.sendStatus(404);

    if (req.userId !== device.userId) return res.sendStatus(403);

    await SecurityService.deleteDeviceByQuery({ deviceId }),
      res.sendStatus(204);
  },
];
