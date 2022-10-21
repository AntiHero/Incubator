import { Request, Response } from 'express';

import SecurityService from '@/domain/security.service';
import { convertToDevice } from '@/utils/covnertToDevice';
import { validateRefreshToken } from '@/customValidators/refreshTokenValidator';
import { customValidationResult } from '@/customValidators/customValidationResults';

export const getAllDevices = [
  validateRefreshToken,
  async (req: Request, res: Response) => {
    if (!customValidationResult(req).isEmpty()) return res.sendStatus(401);

    const docs = await SecurityService.getDevicesList();

    const devices = docs.map(doc => {
      const { id, ...deviceInfo } = convertToDevice(doc);

      return deviceInfo;
    });

    res.type('text/plain').json(devices);
  },
];
