import { Request, Response } from 'express';

import SecurityService from '@/domain/security.service';
import { validateRefreshToken } from '@/customValidators/refreshTokenValidator';
import { customValidationResult } from '@/customValidators/customValidationResults';

export const deleteDevice = [
  validateRefreshToken,
  async (req: Request, res: Response) => {
    if (!customValidationResult(req).isEmpty()) return res.sendStatus(401);

    console.log('--------DELETE /security/devices/id---------');
    console.log(
      req.deviceId,
      'deviceId from token',
      req.params.id,
      'device id from params',
      req.userId,
      'userId'
    );
    const deviceId = req.params.id;

    const device = await SecurityService.getDevice({ deviceId });

    if (!device) return res.sendStatus(404);

    if (req.userId !== device.userId) return res.sendStatus(403);

    await SecurityService.deleteDeviceByQuery({ deviceId }),
      res.sendStatus(204);
  },
];

[
  {
    deviceId: '3b02dbeb-24c2-4e1e-87ad-27b59486d2a9',
    ip: '3.73.132.52',
    lastActiveDate: '2022-10-23T13:15:50.396Z',
    title:
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36',
  },
  {
    deviceId: 'b4602a87-0f23-4d16-9576-3c9384531283',
    ip: '3.73.132.52',
    lastActiveDate: '2022-10-23T13:15:42.773Z',
    title:
      'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:105.0) Gecko/20100101 Firefox/103.0',
  },
  {
    deviceId: '1e49cee7-b55b-46eb-9614-a0c1c6cd38b1',
    ip: '3.73.132.52',
    lastActiveDate: '2022-10-23T13:15:43.345Z',
    title:
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36',
  },
  {
    deviceId: 'ada64a70-cc3f-4293-b3e0-8448f30335a1',
    ip: '3.73.132.52',
    lastActiveDate: '2022-10-23T13:15:43.926Z',
    title:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 12_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.6 Safari/605.1.15',
  },
  {
    deviceId: '378d687b-9575-4b4a-9013-068911a510a1',
    ip: '3.73.132.52',
    lastActiveDate: '2022-10-23T13:15:48.151Z',
    title:
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36',
  },
];
