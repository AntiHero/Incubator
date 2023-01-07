import bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';

import { UsersRepository } from '../adapter/postgres.adapter';

@Injectable()
export class UpdateUserPasswordUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute(code: string, newPassword: string) {
    const userId = await this.findUserByRecoveryCode(code);

    if (!userId) return null;

    const passwordHash = await bcrypt.hash(newPassword, 10);

    const user = await this.usersRepository.findUserByIdAndUpdate(userId, {
      password: passwordHash,
    });

    if (!user) return null;

    await this.usersRepository.setUserRecoveryCode(user.id, { reset: true });

    return user;
  }

  async findUserByRecoveryCode(code: string) {
    const id = await this.usersRepository.findUserByRecoveryCode(code);

    return id;
  }
}
