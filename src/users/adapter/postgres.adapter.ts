import { Repository, DataSource } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Roles } from '../types/roles';
import { User } from '../entity/user.entity';
import { UserDomainModel, UserDTO } from '../types';
import { BanStatus } from 'root/@common/types/enum';
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
import { textChangeRangeIsUnchanged } from 'typescript';

@Injectable()
export class UsersRepository {
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

    return users.map(ConvertToUser.toDTO);
  }

  async addUser(user: UserDomainModel) {
    const { login, email, password, role } = user;

    try {
      const savedUserId = (
        await this.repository.query(
          `INSERT INTO users ("login", "email", "password", "role") 
            VALUES ($1, $2, $3, $4)
            RETURNING id`,
          [login, email, password, role],
        )
      )[0]?.id;

      await this.userBanInfoRepository.query(
        `INSERT INTO users_ban_info ("banDate", "banReason", "isBanned", "userId") 
            VALUES (DEFAULT, DEFAULT, DEFAULT, $1) RETURNING id`,
        [savedUserId],
      );

      await this.passwordRecoveryRepository.query(
        'INSERT INTO password_recovery ("code", "userId") VALUES (DEFAULT, $1) RETURNING id',
        [savedUserId],
      );

      await this.userConfirmationInfoRepository.query(
        `INSERT INTO users_confirmation_info ("expDate", "code", "isConfirmed", "userId") 
            VALUES (${
              Date.now() + fiveMinInMs
            }, DEFAULT, DEFAULT, $1) RETURNING id`,
        [savedUserId],
      );

      const savedUser = (
        await this.repository.query(getUserByIdQuery, [savedUserId])
      )[0];

      return ConvertToUser.toDTO(savedUser);
    } catch (e) {
      console.error(e);

      return null;
    }
  }

  async findUserById(id: string) {
    try {
      const user = (await this.repository.query(getUserByIdQuery, [id]))[0];

      if (!user) return null;

      return ConvertToUser.toDTO(user);
    } catch (e) {
      console.error(e);

      return null;
    }
  }

  async findUserByIdAndDelete(id: string) {
    try {
      const user = await this.repository.findOneBy({ id: Number(id) });

      if (!user) return null;

      await this.userBanInfoRepository
        .createQueryBuilder()
        .delete()
        .from(UserConfirmationInfo)
        .where('userId = :id', { id })
        .execute();

      await this.userConfirmationInfoRepository
        .createQueryBuilder()
        .delete()
        .from(UserConfirmationInfo)
        .where('userId = :id', { id })
        .execute();

      await this.passwordRecoveryRepository
        .createQueryBuilder()
        .delete()
        .from(PasswordRecovery)
        .where('userId = :id', { id })
        .execute();

      await this.repository
        .createQueryBuilder()
        .delete()
        .from(User)
        .where('id = :id', { id })
        .execute();

      return true;
    } catch (e) {
      console.error(e);

      return null;
    }
  }

  async findUserByConfirmationInfoCode(code: string) {
    const confirmationInfoUserId = (
      await this.repository.query(
        `
          SELECT id FROM users_confirmation_info WHERE code=$1
        `,
        [code],
      )
    )[0]?.userId;

    if (!confirmationInfoUserId) return null;

    const user = (
      await this.repository.query(getUserByConfirmationCode, [
        confirmationInfoUserId,
      ])
    )[0];

    if (!user) return null;

    return ConvertToUser.toDTO(user);
  }

  async findUsersByQuery(
    query: PaginationQueryType,
    forRole: Roles = Roles.USER,
  ): Promise<[UserDTO[], number]> {
    const searchLoginTerm = query.searchLoginTerm;
    const searchEmailTerm = query.searchEmailTerm;
    let isBanned = undefined;

    if (forRole === Roles.SUPER_ADMIN) {
      isBanned =
        query.banStatus === BanStatus.banned
          ? true
          : query.banStatus === BanStatus.notBanned
          ? false
          : undefined;
    }

    if (
      typeof searchLoginTerm !== 'string' ||
      typeof searchEmailTerm !== 'string'
    )
      throw new Error('Wrong searchNameTerm type');

    const count = (
      await this.repository.query(
        `
          SELECT COUNT(*) FROM users u
            JOIN "users_ban_info" ubi ON u."id"=ubi."userId"
            WHERE (login ~* $1 OR email ~* $2)
            AND ubi."isBanned"=${
              isBanned === undefined ? `ubi."isBanned"` : isBanned
            } 
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
        isBanned,
        countSkip(query.pageSize, query.pageNumber),
      ),
    );

    return [users.map(ConvertToUser.toDTO), Number(count)];
  }

  async findUserByLoginOrEmail(loginOrEmail: string) {
    try {
      const user = (
        await this.repository.query(getUserByLoginOrEmail, [loginOrEmail])
      )[0];

      if (!user) return null;
      console.log(ConvertToUser.toDTO(user));
      return ConvertToUser.toDTO(user);
    } catch (e) {
      console.error(e);

      return null;
    }
  }

  async findUserByIdAndUpdate(id: string, updates: any) {
    try {
      await this.repository.query(updateUserQuery(updates), [id]);

      const user = (await this.repository.query(getUserByIdQuery, [id]))[0];

      if (!user) return null;

      return ConvertToUser.toDTO(user);
    } catch (e) {
      console.error(e);

      return null;
    }
  }

  async deleteAllUsers() {
    await this.repository.query(
      `
        DELETE FROM users_confirmation_info;
        DELETE FROM users_ban_info;
        DELETE FROM password_recovery;
        DELETE FROM users;
      `,
    );
  }

  async findUserByRecoveryCode(code: string) {
    try {
      const id = (
        await this.repository
          .createQueryBuilder('u')
          .select('id')
          .where(
            'u."id" = (SELECT "userId" FROM password_recovery WHERE code = :code)',
            { code },
          )
          .execute()
      )[0]?.id;

      return id;
    } catch (e) {
      console.log(e);

      return null;
    }
  }

  async setUserRecoveryCode(
    userId: string,
    options: { reset: boolean } = { reset: false },
  ) {
    try {
      const updates = await this.passwordRecoveryRepository
        .createQueryBuilder('pr')
        .update(PasswordRecovery)
        .set({
          code: options.reset ? null : () => 'gen_random_uuid()',
        })
        .where('password_recovery."userId" = :userId)', { userId })
        .returning('code')
        .execute();

      return updates.affected ? updates.raw[0] : null;
    } catch (e) {
      console.log(e);
      return null;
    }
  }
}
