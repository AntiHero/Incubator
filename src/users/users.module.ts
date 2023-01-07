import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './entity/user.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserBanInfo } from './entity/user-ban-info.entity';
import { UsersRepository } from './adapter/postgres.adapter';
import { PasswordRecovery } from './entity/password-recovery.entity';
import { ConfirmUserUseCase } from './use-cases/confirm-user.use-case';
import { EmailManagerModule } from 'root/email-manager/email-manager.module';
import { UserConfirmationInfo } from './entity/user-confirmation-info.entity';
import { UsersBanInfoSqlRepository } from './adapter/user-ban-info-sql.adapter';
import { ConfirmationInfoSqlRepository } from './adapter/user-confirmation-info-sql.adapter';
import { CheckUserConfirmationCodeUseCase } from './use-cases/check-user-confirmation-code.use-case';
import { GetUserByConfirmationCodeUseCase } from './use-cases/find-user-by-confirmation-code.use-case';
import { UpdateUserPasswordUseCase } from './use-cases/update-password.use-case';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      UserBanInfo,
      PasswordRecovery,
      UserConfirmationInfo,
    ]),
    EmailManagerModule,
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    UsersRepository,
    ConfirmUserUseCase,
    UsersBanInfoSqlRepository,
    UpdateUserPasswordUseCase,
    ConfirmationInfoSqlRepository,
    CheckUserConfirmationCodeUseCase,
    GetUserByConfirmationCodeUseCase,
  ],
  exports: [
    UsersService,
    ConfirmUserUseCase,
    UpdateUserPasswordUseCase,
    GetUserByConfirmationCodeUseCase,
    CheckUserConfirmationCodeUseCase,
  ],
})
export class UsersModule {}
