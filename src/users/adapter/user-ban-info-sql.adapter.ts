import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { BanInfo } from '../types';
import { User } from '../entity/user.entity';
import { UserBanInfo } from '../entity/user-ban-info.entity';
import { updateUserBanInfoQuery } from '../query/update-ban-info.query';
import { UserConfirmationInfo } from '../entity/user-confirmation-info.entity';

@Injectable()
export class UsersBanInfoSqlRepository {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(UserConfirmationInfo)
    private readonly usersBanInfoRepository: Repository<UserBanInfo>,
  ) {}

  async banUser(id: string, banData: Partial<BanInfo>) {
    const updates: BanInfo = {
      isBanned: banData.isBanned,
      banReason: banData.isBanned ? banData.banReason : null,
      banDate: banData.isBanned ? banData.banDate : null,
    };

    try {
      const banInfoId = await this.usersRepository.query(
        `
          SELECT "banInfo" FROM users WHERE users.id=$1 LIMIT 1
        `,
        [id],
      )[0]?.confirmationInfo;

      if (!banInfoId) return null;

      await this.usersBanInfoRepository.query(updateUserBanInfoQuery(updates), [
        id,
      ]);

      return true;
    } catch (error) {
      console.error(error);

      return null;
    }
  }
}
