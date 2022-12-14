import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Roles } from '../types/roles';
import { User } from '../entity/user.entity';
import { UserModel } from '../schema/users.schema';
import { UserDomainModel, UserDTO } from '../types';
import { ConvertToUser } from '../utils/convertToUser';
import { PaginationQueryType } from 'root/@common/types';
import { countSkip } from 'root/@common/utils/count-skip';
import { OptionalKey } from 'root/@common/types/utility';
import { getUsersByQuery } from '../query/get-users.query';
import { SortDirectionKeys } from 'root/@common/types/enum';
import { UserBanInfo } from '../entity/user-ban-info.entity';
import { updateUserQuery } from '../query/update-user.query';
import { getUserByIdQuery } from '../query/get-user-by-id.query';
import { PasswordRecovery } from '../entity/password-recovery.entity';
import { getUserByLoginOrEmail } from '../query/get-user-by-email-or-login.query';
import { UserConfirmationInfo } from '../entity/user-confirmation-info.entity';
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
            VALUES (DEFAULT, DEFAULT, DEFAULT) RETURNING id`,
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

      console.log(savedUser, 'savedUser');
      return ConvertToUser.convertToDTO(savedUser);
    } catch (e) {
      console.error(e);

      return null;
    }
  }

  async findUserById(id: string) {
    try {
      const user = (await this.repository.query(getUserByIdQuery, [id]))[0];

      // console.log(
      //   await this.findUsersByQuery({
      //     pageNumber: 3,
      //     pageSize: 1,
      //     searchNameTerm: 'al',
      //     sortBy: 'login',
      //     sortDirection: SortDirectionKeys.desc,
      //   }),
      // );
      // const doc = await this.repository.findOne({ where: { id: Number(id) } });
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
    return (
      await this.repository.query(
        `
          DELETE FROM users WHERE users.id=$1 RETURNING id
        `,
        [id],
      )
    )[0]?.id;
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

    return [users.map(ConvertToUser.convertToDTO), count];
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
        DELETE FROM users
      `,
    );
  }
}

//   async deleteAllUsers() {
//     await this.model.deleteMany({}).exec();
//   }

//   async banUser(id: string, data: OptionalKey<BanInfo, 'banDate'>) {
//     const banInfo: BanInfo = {
//       isBanned: data.isBanned,
//       banReason: data.isBanned ? data.banReason : null,
//       banDate: data.isBanned ? data.banDate : null,
//     };

//     const user = await this.model
//       .findByIdAndUpdate(id, {
//         banInfo,
//       })
//       .lean()
//       .exec();

//     console.log(user, 'user');
//     if (!user) return null;

//     return true;
//   }
// }
