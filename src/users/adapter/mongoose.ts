import mongoose from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';

import { UserDomainModel, UserDTO } from '../types';
import { UserModel } from '../schema/users.schema';
import { PaginationQuery } from 'root/@common/types';
import { countSkip } from 'root/@common/utils/countSkip';
import { convertToUserDTO } from '../utils/convertToUserDTO';

@Injectable()
export class UsersAdapter {
  constructor(
    @InjectModel(UserModel) private model: mongoose.Model<UserModel>,
  ) {}

  async getAllUsers() {
    const users = await this.model.find({}).lean();

    return users.map(convertToUserDTO);
  }

  async addUser(user: UserDomainModel) {
    const createdUser = await this.model.create(user);

    return convertToUserDTO(createdUser);
  }

  async findUserById(id: string) {
    const doc = await this.model.findById(id).lean();

    if (!doc) return null;

    return convertToUserDTO(doc);
  }

  async findUserByIdAndDelete(id: string) {
    return this.model.findByIdAndRemove(id).lean();
  }

  async findUsersByQuery(query: PaginationQuery): Promise<[UserDTO[], number]> {
    const count = await this.model
      .find({
        $or: [
          { login: { $regex: query.searchLoginTerm } },
          { email: { $regex: query.searchEmailTerm } },
        ],
      })
      .count();

    const users = await this.model
      .find({
        $or: [
          { login: { $regex: query.searchLoginTerm } },
          { email: { $regex: query.searchEmailTerm } },
        ],
      })
      .sort({ [query.sortBy]: query.sortDirection })
      .skip(countSkip(query.pageSize, query.pageNumber))
      .limit(query.pageSize)
      .lean();

    return [users.map(convertToUserDTO), count];
  }

  async findUserByLoginOrEmail(login: string, email: string) {
    const user = await this.model.findOne({
      $or: [{ login }, { email }],
    });

    if (!user) return null;

    return convertToUserDTO(user);
  }

  async deleteAllUsers() {
    await this.model.deleteMany({}).exec();
  }
}
