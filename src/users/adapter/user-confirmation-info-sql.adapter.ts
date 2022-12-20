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
    console.log(id);
    try {
      const confirmationInfoId = (
        await this.usersRepository.query(getUserConfirmationInfoIdQuery, [id])
      )[0]?.confirmationInfo;

      console.log(confirmationInfoId);
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

      const userId = (
        await this.usersRepository.query(
          `
          SELECT id FROM users WHERE users."confirmationInfo"=$1
        `,
          [confirmationInfoId],
        )
      )[0]?.id;

      // const user = (
      //   await this.usersRepository.query(getUserByConfirmationCode, [
      //     confirmationInfoId,
      //   ])
      // )[0];

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
    console.log(user);
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
