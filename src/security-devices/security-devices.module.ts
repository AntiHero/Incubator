import { TypeOrmModule } from '@nestjs/typeorm';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { TokensModule } from 'root/tokens/tokens.module';
import { SecurityDevice } from './entity/security-device.entity';
import { SecurityDevicesService } from './security-devices.service';
import { SecurityDevicesController } from './security-devices.controller';
import { SecurityDevicesRepository } from './adapter/security-device.repository';
import { RefreshTokenValidationMiddleware } from 'root/@common/middlewares/refresh-token.validation.middleware';
import { SecurityDevicesQueryRepository } from './adapter/security-device-query.repository';

@Module({
  imports: [
    // TypegooseModule.forFeature([
    //   {
    //     typegooseClass: SecurityDeviceModel,
    //     schemaOptions: { collection: 'securityDevices' },
    //   },
    // ]),
    TypeOrmModule.forFeature([SecurityDevice]),
    TokensModule,
  ],
  providers: [
    SecurityDevicesService,
    SecurityDevicesRepository,
    SecurityDevicesQueryRepository,
  ],
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
