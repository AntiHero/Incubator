import { Request, Response } from 'express';
import { Controller, Delete, Get, Param, Req, Res } from '@nestjs/common';

import { SecurityDevicesService } from './security-devices.service';
import { convertToSecurityDeviceViewModel } from './utils/convertToDeviceViewModel';
import { UserId } from 'root/@common/decorators/user-id.decorator';

@Controller('security/devices')
export class SecurityDevicesController {
  constructor(
    private readonly securityDevicesService: SecurityDevicesService,
  ) {}

  @Get()
  async getSecurityDevice(@Res() res: Response, @Req() req: Request) {
    const devices = await this.securityDevicesService.getDevicesList(
      req.userId,
    );

    const devicesView = devices.map(convertToSecurityDeviceViewModel);

    res.type('text/plain').send(devicesView);
  }

  @Delete(':id')
  async deleteSecurityDevice(
    @Param('id') id: string,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    const device = await this.securityDevicesService.getDevice({
      deviceId: id,
    });

    if (!device) return res.sendStatus(404);

    if (req.userId !== device.userId) return res.sendStatus(403);

    await this.securityDevicesService.deleteDeviceByQuery({ deviceId: id });

    res.status(204).send();
  }

  @Delete()
  async deleteAllDevices(@Res() res: Response, @Req() req: Request) {
    await this.securityDevicesService.terminateAllSessionsButOne({
      userId: req.userId,
      deviceId: req.deviceId,
    });

    res.status(204).send();
  }
}
