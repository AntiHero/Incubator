import {
  Module,
  NestModule,
  RequestMethod,
  MiddlewareConsumer,
} from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { User } from 'root/users/entity/user.entity';
import { UsersModule } from 'root/users/users.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { TokensModule } from 'root/tokens/tokens.module';
import { SecurityDevicesModule } from 'root/security-devices/security-devices.module';
import { ValidateRecoveryCode } from 'root/@common/decorators/validate-uuid.decorator';
// import { IpRestrictionMiddleware } from 'root/@common/middlewares/ip-restriction.middleware';
import { PasswordAuthorizationMiddleware } from 'root/@common/middlewares/password-authorization.middleware';
import { RefreshTokenValidationMiddleware } from 'root/@common/middlewares/refresh-token.validation.middleware';

@Module({
  imports: [
    UsersModule,
    TokensModule,
    PassportModule,
    SecurityDevicesModule,
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, ValidateRecoveryCode],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      // .apply(IpRestrictionMiddleware)
      // .forRoutes(
      //   {
      //     path: 'auth/registration',
      //     method: RequestMethod.POST,
      //   },
      //   {
      //     path: 'auth/registration-confirmation',
      //     method: RequestMethod.POST,
      //   },
      //   {
      //     path: 'auth/registration-email-resending',
      //     method: RequestMethod.POST,
      //   },
      //   { path: 'auth/login', method: RequestMethod.POST },
      // )
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
