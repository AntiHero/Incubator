import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { Injectable } from '@nestjs/common';

import { UserForToken } from 'root/auth/types';
import { UsersAdapter } from './adapter/mongoose';
import { BanInfo, UserDomainModel } from './types';
import { PaginationQuery } from 'root/@common/types';
import { fiveMinInMs } from 'root/@common/constants';
import { OptionalKey } from 'root/@common/types/utility';
import { EmailManager } from 'root/email-manager/email-manager';

@Injectable()
export class UsersService {
  constructor(
    private usersRepository: UsersAdapter,
    private emailManager: EmailManager,
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
      role,
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
        // expiresIn: 600,
        expiresIn: 10,
      },
    );

    const refreshToken = jwt.sign(
      userForToken,
      process.env.SECRET ?? 'simple_secret',
      {
        // expiresIn: 1000
        expiresIn: 20,
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
    return this.usersRepository.findUserByLoginOrEmail(loginOrEmail, email);
  }

  async validateUser(data: UserDomainModel) {
    const user = await this.usersRepository.findUserByLoginOrEmail(
      data.login,
      data.email,
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

  async findUsersByQuery(query: PaginationQuery) {
    return this.usersRepository.findUsersByQuery(query);
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

  async resendConfirmationEmail(id: string, email: string) {
    const newCode = uuidv4();

    await this.usersRepository.findUserByIdAndUpdate(id, {
      'confirmationInfo.expDate': Date.now() + fiveMinInMs,
      'confirmationInfo.code': newCode,
    });

    await this.emailManager.sendConfirmationEmail({
      to: email as string,
      code: newCode,
    });
  }

  async banUser(id: string, data: Omit<BanInfo, 'banDate'>) {
    let banInfo: OptionalKey<BanInfo, 'banDate'>;

    if (data.isBanned) {
      banInfo = { ...data, banDate: new Date().toISOString() };
    } else {
      banInfo = { ...data };
    }

    return this.usersRepository.banUser(id, banInfo);
  }
}
