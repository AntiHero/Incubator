import mongoose from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import {
  UserDomainModel,
  UserDTO,
  UserLeanModel,
  UserSchemaModel,
} from '../types';
import { PaginationQuery } from 'root/_common/types';
import { countSkip } from 'root/_common/utils/countSkip';
import { convertToUserDTO } from '../utils/convertToUserDTO';

@Injectable()
export class UsersAdapter {
  constructor(
    @InjectModel('user') private model: mongoose.Model<UserSchemaModel>,
  ) {}

  async getAllUsers() {
    const users = await this.model.find<UserLeanModel>({}).lean();

    return users.map((user) => convertToUserDTO(user));
  }

  async addUser(user: UserDomainModel) {
    const createdUser = await this.model.create({ ...user });

    return convertToUserDTO(createdUser);
  }

  async findUserById(id: string) {
    const doc = await this.model
      .findById<UserLeanModel>(id)
      .lean()
      .populate('comments')
      .populate('likes');

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

  async deleteAllUsers() {
    await this.model.deleteMany({}).exec();
  }
}
