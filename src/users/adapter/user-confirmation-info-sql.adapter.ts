import { Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from '../entity/user.entity';
import { ConvertToUser } from '../utils/convertToUser';
import { getUserByIdQuery } from '../query/get-user-by-id.query';
import { UserConfirmationInfo } from '../entity/user-confirmation-info.entity';
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
      const confirmationInfoId = (
        await this.usersRepository.query(getUserConfirmationInfoIdQuery, [id])
      )[0]?.id;

      if (!confirmationInfoId) return null;

      await this.userConfirmationInfoRepository.query(
        `
          UPDATE users_confirmation_info SET "isConfirmed"=TRUE WHERE users_confirmation_info.id=$1
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
      const userId = (
        await this.usersRepository.query(
          `
          SELECT "userId" FROM users_confirmation_info WHERE code=$1
        `,
          [code],
        )
      )[0]?.userId;

      if (!userId) return null;

      const user = (
        await this.usersRepository.query(getUserByIdQuery, [userId])
      )[0];

      if (!user) return null;

      return ConvertToUser.toDTO(user);
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

  async updateConfirmationInfoCode(id: string, expDate: number) {
    try {
      const confirmationInfoId = (
        await this.usersRepository.query(getUserConfirmationInfoIdQuery, [id])
      )[0]?.confirmationInfo;

      if (!confirmationInfoId) return null;

      const code = (
        await this.userConfirmationInfoRepository.query(
          updateUserConfirmationInfo({
            expDate,
          }),
          [confirmationInfoId],
        )
      )[0][0]?.code;

      return code;
    } catch (error) {
      console.error(error);

      return null;
    }
  }
}
