import bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';

import { UserDomainModel } from './types';
import { UsersAdapter } from './adapter/mongoose';
import { PaginationQuery } from 'root/@common/types';
import { EmailManager } from 'root/email-manager/email-manager';

@Injectable()
export class UsersService {
  constructor(
    private usersRepository: UsersAdapter,
    private emailManager: EmailManager,
  ) {}

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

  async findUserByLoginOrEmail(login: string, email: string) {
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
}
