import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './entity/user.entity';
import { UsersService } from './users.service';
import { UserModel } from './schema/users.schema';
import { UsersAdapter } from './adapter/mongoose';
import { TypegooseModule } from 'nestjs-typegoose';
import { UsersController } from './users.controller';
import { UserBanInfo } from './entity/user-ban-info.entity';
import { UsersSqlAdapter } from './adapter/postgres.adapter';
import { PasswordRecovery } from './entity/password-recovery.entity';
import { EmailManagerModule } from 'root/email-manager/email-manager.module';
import { UserConfirmationInfo } from './entity/user-confirmation-info.entity';

@Module({
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: UserModel,
        schemaOptions: { collection: 'users' },
      },
    ]),
    TypeOrmModule.forFeature([
      User,
      UserBanInfo,
      PasswordRecovery,
      UserConfirmationInfo,
    ]),
    EmailManagerModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersAdapter, UsersSqlAdapter],
  exports: [UsersService],
})
export class UsersModule {}
