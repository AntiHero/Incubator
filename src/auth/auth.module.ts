import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'root/users/users.module';
import { TokensModule } from 'root/tokens/tokens.module';
import { SecurityDevicesModule } from 'root/security-devices/security-devices.module';
import { PasswordAuthorizationMiddleware } from 'root/@common/middlewares/password-authorization.middleware';
import { RefreshTokenValidationMiddleware } from 'root/@common/middlewares/refresh-token.validation.middleware';

@Module({
  imports: [UsersModule, SecurityDevicesModule, TokensModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(PasswordAuthorizationMiddleware)
      .forRoutes({
        path: '/auth/login',
        method: RequestMethod.POST,
      })
      .apply(RefreshTokenValidationMiddleware)
      .forRoutes(
        {
          path: 'auth/refresh-token',
          method: RequestMethod.POST,
        },
        { path: 'auth/logout', method: RequestMethod.POST },
      );
  }
}
