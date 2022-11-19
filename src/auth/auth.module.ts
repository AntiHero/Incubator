import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'root/users/users.module';
import { SecurityDevicesModule } from 'root/security-devices/security-devices.module';
import { PasswordAuthorizationMiddleware } from 'root/@common/middlewares/password-authorization.middleware';

@Module({
  imports: [UsersModule, SecurityDevicesModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(PasswordAuthorizationMiddleware).forRoutes({
      path: '/auth/login',
      method: RequestMethod.POST,
    });
  }
}
