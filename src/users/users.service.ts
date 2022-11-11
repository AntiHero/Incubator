import { Injectable } from '@nestjs/common';

import { UserDomainModel } from './types';
import { UsersAdapter } from './adapter/mongoose';
import { PaginationQuery } from 'root/_common/types';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersAdapter) {}

  async saveUser(data: UserDomainModel) {
    return this.usersRepository.addUser(data);
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
