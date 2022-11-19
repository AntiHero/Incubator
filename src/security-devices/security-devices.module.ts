import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { SecurityDevicesAdapter } from './adapter/mongoose';
import { SecurityDevicesService } from './security-devices.service';
import { SecurityDeviceModel } from './schemas/security-device.schema';

@Module({
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: SecurityDeviceModel,
        schemaOptions: { collection: 'securityDevices' },
      },
    ]),
  ],
  providers: [SecurityDevicesService, SecurityDevicesAdapter],
  exports: [SecurityDevicesService],
})
export class SecurityDevicesModule {}
