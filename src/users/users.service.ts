import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { Injectable, UsePipes } from '@nestjs/common';

import { Roles } from './types/roles';
import { UserForToken } from 'root/auth/types';
import { UsersAdapter } from './adapter/mongoose';
import { BanInfo, UserDomainModel } from './types';
import { fiveMinInMs } from 'root/@common/constants';
import { OptionalKey } from 'root/@common/types/utility';
import { UsersSqlAdapter } from './adapter/postgres.adapter';
import { EmailManager } from 'root/email-manager/email-manager';
import { PaginationQuery, PaginationQueryType } from 'root/@common/types';
import { UsersBanInfoSqlRepository } from './adapter/user-ban-info-sql.adapter';
import { ConfirmationInfoSqlRepository } from './adapter/user-confirmation-info-sql.adapter';
import { UserUnicityValidationPipe } from 'root/@common/pipes/user-unicity-validation.pipe';

@Injectable()
export class UsersService {
  constructor(
    private emailManager: EmailManager,
    private usersRepository: UsersAdapter,
    private usersSqlRepository: UsersSqlAdapter,
    private readonly userBanInfoSqlRepository: UsersBanInfoSqlRepository,
    private readonly usersConfirmationInfoSqlRepository: ConfirmationInfoSqlRepository,
  ) {}

  async authenticateUser(loginOrEmail: string, password: string) {
    // const user = await this.usersRepository.findUserByLoginOrEmail(
    //   loginOrEmail,
    // );
    const user = await this.usersSqlRepository.findUserByLoginOrEmail(
      loginOrEmail,
    );

    if (!user) return false;

    const passwordCorrect = await bcrypt.compare(password, user.password);

    if (!passwordCorrect) return false;

    return true;
  }

  // @UsePipes(UserUnicityValidationPipe)
  async createUser(data: UserDomainModel) {
    const saltRounds = 10;
    const { login, password, email, role } = data;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    const user = await this.usersSqlRepository.addUser({
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
        expiresIn: 600,
        // expiresIn: 10,
      },
    );

    const refreshToken = jwt.sign(
      userForToken,
      process.env.SECRET ?? 'simple_secret',
      {
        expiresIn: 1000,
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

  async findUserByLoginOrEmail(loginOrEmail: string, email?: string) {
    // return this.usersRepository.findUserByLoginOrEmail(loginOrEmail, email);
    return this.usersSqlRepository.findUserByLoginOrEmail(loginOrEmail);
  }

  async validateUser(data: UserDomainModel) {
    // const user = await this.usersRepository.findUserByLoginOrEmail(
    //   data.login,
    //   data.email,
    // );
    const user = await this.usersSqlRepository.findUserByLoginOrEmail(
      data.login,
    );

    const passwordCorrect =
      user === null
        ? false
        : await bcrypt.compare(data.password, user.password);

    return passwordCorrect;
  }

  async checkUsersConfirmation(code: string) {
    const user = await this.usersRepository.findUserByQuery({
      'confirmationInfo.code': code,
    });

    if (
      !user ||
      user.confirmationInfo.isConfirmed ||
      user.confirmationInfo.expDate < Date.now()
    )
      return null;

    return true;
  }

  async findUserByQuery(query: any) {
    return this.usersRepository.findUserByQuery(query);
  }

  // async findUsersByQuery(query: PaginationQuery) {
  async findUsersByQuery(query: PaginationQueryType) {
    // return this.usersRepository.findUsersByQuery(query);
    return this.usersSqlRepository.findUsersByQuery(query);
  }

  async getAllUsers() {
    return this.usersSqlRepository.getAllUsers();
    // return this.usersRepository.getAllUsers();
  }

  async findUserById(id: string) {
    // return this.usersRepository.findUserById(id);
    return this.usersSqlRepository.findUserById(id);
  }

  async findUserByIdAndDelete(id: string) {
    // return this.usersRepository.findUserByIdAndDelete(id);
    return this.usersSqlRepository.findUserByIdAndDelete(id);
  }

  async deleteAllUsers() {
    // await this.usersRepository.deleteAllUsers();
    await this.usersSqlRepository.deleteAllUsers();
  }

  async resendConfirmationEmail(id: string, email: string) {
    const code = uuidv4();
    const expDate = Date.now() + fiveMinInMs;

    // await this.usersRepository.findUserByIdAndUpdate(id, {
    //   'confirmationInfo.expDate': Date.now() + fiveMinInMs,
    //   'confirmationInfo.code': newCode,
    // });
    await this.usersConfirmationInfoSqlRepository.updateConfirmationInfoCode(
      id,
      code,
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

    // return this.usersRepository.banUser(id, banInfo);
    return this.userBanInfoSqlRepository.banUser(id, banInfo);
  }
}
