import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { PasswordRecovery } from 'root/users/entity/password-recovery.entity';
import { UserBanInfo } from 'root/users/entity/user-ban-info.entity';
import { UserConfirmationInfo } from 'root/users/entity/user-confirmation-info.entity';
import { User } from 'root/users/entity/user.entity';

export const getPostgresConfig = async (
  configService: ConfigService,
): Promise<TypeOrmModuleOptions> => {
  return {
    type: 'postgres',
    url: configService.get('DATABASE_URL'),
    synchronize: process.env.DEV_MODE ? true : false,
    entities: [User, UserBanInfo, PasswordRecovery, UserConfirmationInfo],
  };
};
