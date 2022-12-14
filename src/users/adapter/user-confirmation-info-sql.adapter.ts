import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from '../entity/user.entity';
import { ConvertToUser } from '../utils/convertToUser';
import { UserConfirmationInfo } from '../entity/user-confirmation-info.entity';
import { getUserByConfirmationCode } from '../query/get-user-by-confirmation-code.query';
import { updateUserConfirmationInfo } from '../query/update-user-confirmation-info.query';
import { getUserConfirmationInfoIdQuery } from '../query/get-user-confirmation-info-id.query';

@Injectable()
export class ConfirmationInfoSqlRepository {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(UserConfirmationInfo)
    private readonly userConfirmationInfoRepository: Repository<UserConfirmationInfo>,
  ) {}

  async confirmUser(id: string) {
    try {
      const confirmationInfoId = await this.usersRepository.query(
        getUserConfirmationInfoIdQuery,
        [id],
      )[0]?.confirmationInfo;

      if (!confirmationInfoId) return null;

      await this.userConfirmationInfoRepository.query(
        `
          UPDATE user_confirmation_info SET "isConfirmed"=TRUE WHERE user_confirmation_info.id=$1
        `,
        [confirmationInfoId],
      );
    } catch (error) {
      console.error(error);

      return null;
    }
  }

  async findUserByConfirmationCode(code: string) {
    try {
      const confirmationInfoId = (
        await this.usersRepository.query(
          `
          SELECT id FROM user_confirmation_info WHERE code=$1
        `,
          [code],
        )
      )[0]?.id;

      if (!confirmationInfoId) return null;

      const user = (
        await this.usersRepository.query(getUserByConfirmationCode, [
          confirmationInfoId,
        ])
      )[0];

      if (!user) return null;

      return ConvertToUser.convertToDTO(user);
    } catch (error) {
      console.error(error);

      return null;
    }
  }

  async checkUserConfirmationCode(code: string) {
    const user = await this.findUserByConfirmationCode(code);

    if (
      !user ||
      user.confirmationInfo.isConfirmed ||
      user.confirmationInfo.expDate < Date.now()
    )
      return null;

    return true;
  }

  async updateConfirmationInfoCode(id: string, code: string, expDate: number) {
    try {
      const confirmationInfoId = await this.usersRepository.query(
        getUserConfirmationInfoIdQuery,
        [id],
      )[0]?.confirmationInfo;

      if (!confirmationInfoId) return null;

      await this.userConfirmationInfoRepository.query(
        updateUserConfirmationInfo({
          code,
          expDate,
        }),
        [id],
      );

      return true;
    } catch (error) {
      console.error(error);

      return null;
    }
  }
}
