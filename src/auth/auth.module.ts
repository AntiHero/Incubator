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
import { IpRestrictionMiddleware } from 'root/@common/middlewares/ip-restriction.middleware';

@Module({
  imports: [UsersModule, SecurityDevicesModule, TokensModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(IpRestrictionMiddleware)
      .forRoutes(
        {
          path: 'auth/registration',
          method: RequestMethod.POST,
        },
        {
          path: 'auth/registration-confirmation',
          method: RequestMethod.POST,
        },
        {
          path: 'auth/registration-email-resending',
          method: RequestMethod.POST,
        },
        { path: 'auth/login', method: RequestMethod.POST },
      )
      .apply(PasswordAuthorizationMiddleware)
      .forRoutes({
        path: 'auth/login',
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
