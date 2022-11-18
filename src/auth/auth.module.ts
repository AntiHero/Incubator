import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'root/users/users.module';
import { UserUnicityMiddleware } from 'root/@common/middlewares/user.unictiy.middleware';

@Module({
  imports: [UsersModule],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // consumer.apply(UserUnicityMiddleware).forRoutes({
    //   path: 'auth/registration',
    //   method: RequestMethod.POST,
    // });
  }
}
