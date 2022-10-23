import { Request, Response } from 'express';

import SecurityService from '@/domain/security.service';
import { convertToDevice } from '@/utils/covnertToDevice';
import { validateRefreshToken } from '@/customValidators/refreshTokenValidator';
import { customValidationResult } from '@/customValidators/customValidationResults';

export const getAllDevices = [
  validateRefreshToken,
  async (req: Request, res: Response) => {
    console.log('----------GET /security/devices/---------');
    console.log(
      JSON.stringify({
        errorsMessages: customValidationResult(req).array({
          onlyFirstError: true,
        }),
      }), 'ошибки токена'
    );
    if (!customValidationResult(req).isEmpty()) return res.sendStatus(401);

    const docs = await SecurityService.getDevicesList();

    const devices = docs.map(doc => {
      const device = convertToDevice(doc);

      return device;
    });

    console.log(devices, 'device list');
    console.log(req.userId, 'userId');
    console.log(req.deviceId, 'deviceId');

    res.type('text/plain').json(devices);
  },
];
