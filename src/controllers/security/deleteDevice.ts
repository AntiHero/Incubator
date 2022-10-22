import { Request, Response } from 'express';

import SecurityService from '@/domain/security.service';
import { validateRefreshToken } from '@/customValidators/refreshTokenValidator';
import { customValidationResult } from '@/customValidators/customValidationResults';

export const deleteDevice = [
  validateRefreshToken,
  async (req: Request, res: Response) => {
    if (!customValidationResult(req).isEmpty()) return res.sendStatus(401);

    const deviceId = req.params.id;
    console.log(req.params.id, 'id');

    const device = await SecurityService.getDevice({ deviceId });

    if (!device) return res.sendStatus(404);

    if (device.userId.toString() !== deviceId) return res.sendStatus(403);

    console.log(await SecurityService.deleteDeviceByQuery({ deviceId }));

    res.sendStatus(204);
  },
];

[
  {
    deviceId: '060a6cea-4b8e-4985-8d8a-90d575af49f2',
    ip: '3.73.132.52',
    lastActiveDate: '2022-10-22T22:39:18.893Z',
    title:
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36',
  },
  {
    deviceId: '054fe4f1-f9ed-418c-aadf-be8c1f001b2b',
    ip: '3.73.132.52',
    lastActiveDate: '2022-10-22T22:39:11.433Z',
    title:
      'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:105.0) Gecko/20100101 Firefox/103.0',
  },
  {
    deviceId: 'd56b4772-7ec6-424d-ac13-1135c46feab2',
    ip: '3.73.132.52',
    lastActiveDate: '2022-10-22T22:39:12.009Z',
    title:
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36',
  },
  {
    deviceId: '28ed5a86-ec08-44d5-9c59-50f6ab8d2030',
    ip: '3.73.132.52',
    lastActiveDate: '2022-10-22T22:39:12.583Z',
    title:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 12_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.6 Safari/605.1.15',
  },
  {
    deviceId: 'da335c1f-b23c-4918-b311-60771d4aeffd',
    ip: '3.73.132.52',
    lastActiveDate: '2022-10-22T22:39:16.615Z',
    title:
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36',
  },
];
