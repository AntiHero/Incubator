import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { Injectable } from '@nestjs/common';

import { Roles } from './types/roles';
import { UserForToken } from 'root/auth/types';
import { BanInfo, UserDomainModel } from './types';
import { fiveMinInMs } from 'root/@common/constants';
import { PaginationQueryType } from 'root/@common/types';
import { OptionalKey } from 'root/@common/types/utility';
import { UsersRepository } from './adapter/postgres.adapter';
import { EmailManager } from 'root/email-manager/email-manager';
import { UsersBanInfoSqlRepository } from './adapter/user-ban-info-sql.adapter';
import { ConfirmationInfoSqlRepository } from './adapter/user-confirmation-info-sql.adapter';

@Injectable()
export class UsersService {
  constructor(
    private readonly emailManager: EmailManager,
    private readonly usersRepository: UsersRepository,
    private readonly userBanInfoSqlRepository: UsersBanInfoSqlRepository,
    private readonly usersConfirmationInfoSqlRepository: ConfirmationInfoSqlRepository,
  ) {}

  async authenticateUser(loginOrEmail: string, password: string) {
    const user = await this.usersRepository.findUserByLoginOrEmail(
      loginOrEmail,
    );

    if (!user) return false;

    const passwordCorrect = await bcrypt.compare(password, user.password);

    if (!passwordCorrect) return false;

    return true;
  }

  async createUser(data: UserDomainModel) {
    const saltRounds = 10;
    const { login, password, email, role } = data;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = await this.usersRepository.addUser({
      login,
      email,
      password: passwordHash,
      role: role ?? Roles.USER,
    });

    if (!user) return null;

    await this.emailManager.sendConfirmationEmail({
      to: email as string,
      code: user.confirmationInfo.code,
    });

    return user;
  }

  private async generateTokens(userForToken: Record<string, string>) {
    const token = jwt.sign(
      userForToken,
      process.env.SECRET ?? 'simple_secret',
      {
        expiresIn: 6000,
        // expiresIn: 10,
      },
    );

    const refreshToken = jwt.sign(
      userForToken,
      process.env.SECRET ?? 'simple_secret',
      {
        expiresIn: 10000,
        // expiresIn: 20,
      },
    );

    return [token, refreshToken];
  }

  async confirmUser(id: string) {
    return this.usersRepository.findUserByIdAndUpdate(id, {
      'confirmationInfo.isConfirmed': true,
    });
  }

  async createTokensPair({ login, userId, deviceId }: UserForToken) {
    const userForToken = {
      username: login,
      id: userId,
      deviceId,
    };

    return this.generateTokens(userForToken);
  }

  async findUserByLoginOrEmail(loginOrEmail: string) {
    if (!loginOrEmail) return null;

    return this.usersRepository.findUserByLoginOrEmail(loginOrEmail);
  }

  async validateUser(data: UserDomainModel) {
    const user = await this.usersRepository.findUserByLoginOrEmail(data.login);

    const passwordCorrect =
      user === null
        ? false
        : await bcrypt.compare(data.password, user.password);

    return passwordCorrect;
  }

  async findUsersByQuery(
    query: PaginationQueryType,
    forRole: Roles = Roles.USER,
  ) {
    return this.usersRepository.findUsersByQuery(query, forRole);
  }

  async getAllUsers() {
    return this.usersRepository.getAllUsers();
  }

  async findUserById(id: string) {
    return this.usersRepository.findUserById(id);
  }

  async findUserByIdAndDelete(id: string) {
    return this.usersRepository.findUserByIdAndDelete(id);
  }

  async deleteAllUsers() {
    await this.usersRepository.deleteAllUsers();
  }

  async sendRecoveryEmail(userId: string, email: string) {
    const codeData = await this.usersRepository.setUserRecoveryCode(userId);

    if (codeData) {
      const { code } = codeData;

      await this.emailManager.sendRecoveryEmail({
        to: email,
        code,
      });
    }
  }

  async resendConfirmationEmail(id: string, email: string) {
    const expDate = Date.now() + fiveMinInMs;

    const code =
      await this.usersConfirmationInfoSqlRepository.updateConfirmationInfoCode(
        id,
        expDate,
      );

    await this.emailManager.sendConfirmationEmail({
      to: email as string,
      code,
    });
  }

  async banUser(id: string, data: Omit<BanInfo, 'banDate'>) {
    let banInfo: OptionalKey<BanInfo, 'banDate'>;

    if (data.isBanned) {
      banInfo = { ...data, banDate: new Date().toISOString() };
    } else {
      banInfo = { ...data };
    }

    return this.userBanInfoSqlRepository.banUser(id, banInfo);
  }
}
