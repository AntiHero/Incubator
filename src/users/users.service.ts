import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { Injectable } from '@nestjs/common';

import { UserDomainModel } from './types';
import { UserForToken } from 'root/auth/types';
import { UsersAdapter } from './adapter/mongoose';
import { PaginationQuery } from 'root/@common/types';
import { fiveMinInMs } from 'root/@common/constants';
import { EmailManager } from 'root/email-manager/email-manager';

@Injectable()
export class UsersService {
  constructor(
    private usersRepository: UsersAdapter,
    private emailManager: EmailManager,
  ) {}

  async authenticateUser(data: Partial<UserDomainModel>) {
    const user = await this.usersRepository.findUserByLoginOrEmail(
      data.login || data.email,
    );

    if (!user) return false;

    const passwordCorrect = await bcrypt.compare(data.password, user.password);

    if (!passwordCorrect) return false;

    return true;
  }

  async saveUser(data: UserDomainModel) {
    const saltRounds = 10;

    const { login, password, email } = data;

    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = await this.usersRepository.addUser({
      login,
      email,
      password: passwordHash,
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
      },
    );

    const refreshToken = jwt.sign(
      userForToken,
      process.env.SECRET ?? 'simple_secret',
      { expiresIn: 1200 },
    );

    return [token, refreshToken];
  }

  async createTokensPair({ login, userId, deviceId }: UserForToken) {
    const userForToken = {
      username: login,
      id: userId,
      deviceId,
    };

    return this.generateTokens(userForToken);
  }

  async findUserByLoginOrEmail(login: string, email?: string) {
    return this.usersRepository.findUserByLoginOrEmail(login, email);
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
}
