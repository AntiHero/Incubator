import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { TokensModule } from 'root/tokens/tokens.module';
import { SecurityDevicesAdapter } from './adapter/mongoose';
import { SecurityDevicesService } from './security-devices.service';
import { SecurityDeviceModel } from './schemas/security-device.schema';
import { SecurityDevicesController } from './security-devices.controller';
import { RefreshTokenValidationMiddleware } from 'root/@common/middlewares/refresh-token.validation.middleware';

@Module({
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: SecurityDeviceModel,
        schemaOptions: { collection: 'securityDevices' },
      },
    ]),
    TokensModule,
  ],
  providers: [SecurityDevicesService, SecurityDevicesAdapter],
  exports: [SecurityDevicesService],
  controllers: [SecurityDevicesController],
})
export class SecurityDevicesModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RefreshTokenValidationMiddleware)
      .forRoutes('security/devices');
  }
}
