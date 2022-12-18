import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from '../entity/user.entity';
import { UserDomainModel, UserDTO } from '../types';
import { fiveMinInMs } from 'root/@common/constants';
import { ConvertToUser } from '../utils/convertToUser';
import { PaginationQueryType } from 'root/@common/types';
import { countSkip } from 'root/@common/utils/count-skip';
import { getUsersByQuery } from '../query/get-users.query';
import { UserBanInfo } from '../entity/user-ban-info.entity';
import { updateUserQuery } from '../query/update-user.query';
import { getUserByIdQuery } from '../query/get-user-by-id.query';
import { PasswordRecovery } from '../entity/password-recovery.entity';
import { UserConfirmationInfo } from '../entity/user-confirmation-info.entity';
import { getUserByLoginOrEmail } from '../query/get-user-by-email-or-login.query';
import { getUserByConfirmationCode } from '../query/get-user-by-confirmation-code.query';

@Injectable()
export class UsersSqlAdapter {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
    @InjectRepository(UserBanInfo)
    private readonly userBanInfoRepository: Repository<UserBanInfo>,
    @InjectRepository(PasswordRecovery)
    private readonly passwordRecoveryRepository: Repository<PasswordRecovery>,
    @InjectRepository(UserConfirmationInfo)
    private readonly userConfirmationInfoRepository: Repository<UserConfirmationInfo>,
  ) {}

  async getAllUsers() {
    const users = await this.repository.query('SELECT * FROM users');

    return users.map(ConvertToUser.convertToDTO);
  }

  async addUser(user: UserDomainModel) {
    const { login, email, password, role } = user;

    try {
      const banInfoId = (
        await this.userBanInfoRepository.query(
          `INSERT INTO user_ban_info ("banDate", "banReason", "isBanned") 
            VALUES (DEFAULT, DEFAULT, DEFAULT) RETURNING id`,
        )
      )[0]?.id;

      const passwordRecoveryId = (
        await this.passwordRecoveryRepository.query(
          'INSERT INTO password_recovery ("code") VALUES (DEFAULT) RETURNING id',
        )
      )[0]?.id;

      const confirmationInfoId = (
        await this.userConfirmationInfoRepository.query(
          `INSERT INTO user_confirmation_info ("expDate", "code", "isConfirmed") 
            VALUES (${
              Date.now() + fiveMinInMs
            }, DEFAULT, DEFAULT) RETURNING id`,
        )
      )[0]?.id;

      const savedUserId = (
        await this.repository.query(
          `INSERT INTO users ("login", "email", "password", "banInfo", "confirmationInfo",
            "passwordRecovery", "role") 
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING id`,
          [
            login,
            email,
            password,
            banInfoId,
            confirmationInfoId,
            passwordRecoveryId,
            role,
          ],
        )
      )[0]?.id;

      const savedUser = (
        await this.repository.query(getUserByIdQuery, [savedUserId])
      )[0];

      return ConvertToUser.convertToDTO(savedUser);
    } catch (e) {
      console.error(e);

      return null;
    }
  }

  async findUserById(id: string) {
    try {
      const user = (await this.repository.query(getUserByIdQuery, [id]))[0];

      if (!user) return null;

      return ConvertToUser.convertToDTO(user);
    } catch (e) {
      console.error(e);

      return null;
    }
  }

  async findUserByIdAndDelete(id: string) {
    // const user = await this.repository.find({ where: { id: Number(id) } });

    // return this.repository.remove(user);
    try {
      const foreignIds = (
        await this.repository.query(
          `
          SELECT "banInfo", "passwordRecovery", "confirmationInfo"
            FROM users WHERE users.id=$1
        `,
          [id],
        )
      )[0];

      if (!foreignIds) return null;

      await this.repository.query(
        `
          DELETE FROM users WHERE users.id=$1
        `,
        [id],
      );

      await this.repository.query(
        `
          DELETE FROM user_ban_info WHERE user_ban_info.id=$1
        `,
        [foreignIds.banInfo],
      );

      await this.repository.query(
        `
          DELETE FROM password_recovery WHERE password_recovery.id=$1
        `,
        [foreignIds.passwordRecovery],
      );

      await this.repository.query(
        `
          DELETE FROM user_confirmation_info WHERE user_confirmation_info.id=$1
        `,
        [foreignIds.confirmationInfo],
      );

      return true;
    } catch (e) {
      console.error(e);

      return null;
    }
  }

  async findUserByConfirmationInfoCode(code: string) {
    const confirmationInfoId = (
      await this.repository.query(
        `
          SELECT id FROM user_confirmation_info WHERE code=$1
        `,
        [code],
      )
    )[0]?.id;

    console.log(confirmationInfoId);
    if (!confirmationInfoId) return null;

    const user = (
      await this.repository.query(getUserByConfirmationCode, [
        confirmationInfoId,
      ])
    )[0];

    if (!user) return null;

    return ConvertToUser.convertToDTO(user);
  }

  async findUsersByQuery(
    query: PaginationQueryType,
  ): Promise<[UserDTO[], number]> {
    const searchLoginTerm = query.searchLoginTerm;
    const searchEmailTerm = query.searchEmailTerm;

    if (
      typeof searchLoginTerm !== 'string' ||
      typeof searchEmailTerm !== 'string'
    )
      throw new Error('Wrong searchNameTerm type');

    const count = (
      await this.repository.query(
        `
          SELECT COUNT(*) FROM users WHERE login ~* $1 OR email ~* $2
        `,
        [searchLoginTerm, searchEmailTerm],
      )
    )[0]?.count;

    const users = await this.repository.query(
      getUsersByQuery(
        searchLoginTerm,
        searchEmailTerm,
        query.sortBy,
        query.sortDirection,
        query.pageSize,
        countSkip(query.pageSize, query.pageNumber),
      ),
    );

    return [users.map(ConvertToUser.convertToDTO), Number(count)];
  }

  async findUserByLoginOrEmail(loginOrEmail: string) {
    try {
      const user = (
        await this.repository.query(getUserByLoginOrEmail, [loginOrEmail])
      )[0];

      if (!user) return null;

      return ConvertToUser.convertToDTO(user);
    } catch (e) {
      console.error(e);

      return null;
    }
  }

  async findUserByIdAndUpdate(id: string, updates: any) {
    try {
      await this.repository.query(updateUserQuery(updates), [id]);

      const user = await this.repository.query(getUserByIdQuery, [id]);

      if (!user) return null;

      return ConvertToUser.convertToDTO(user);
    } catch (e) {
      console.error(e);

      return null;
    }
  }

  async deleteAllUsers() {
    await this.repository.query(
      `
        DELETE FROM users;
        DELETE FROM user_ban_info;
        DELETE FROM password_recovery;
        DELETE FROM user_confirmation_info;
      `,
    );
  }
}
