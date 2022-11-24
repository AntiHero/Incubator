import mongoose from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';

import { UserModel } from '../schema/users.schema';
import { PaginationQuery } from 'root/@common/types';
import { countSkip } from 'root/@common/utils/countSkip';
import { OptionalKey } from 'root/@common/types/utility';
import { convertToUserDTO } from '../utils/convertToUserDTO';
import { BanInfo, UserDomainModel, UserDTO } from '../types';

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

  async findUserByQuery(query: any) {
    const user = await this.model.findOne(query).exec();

    if (!user) return null;

    return convertToUserDTO(user);
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

  async findUserByLoginOrEmail(login: string, email?: string) {
    const user = await this.model.findOne({
      $or: [{ login: login }, { email: email || login }],
    });

    if (!user) return null;

    return convertToUserDTO(user);
  }

  async findUserByIdAndUpdate(id: string, updates: any) {
    try {
      const updatedUser = await this.model
        .findByIdAndUpdate(id, updates, {
          projection: '_id',
        })
        .exec();

      return updatedUser && true;
    } catch (e) {
      console.log(e);

      return null;
    }
  }

  async deleteAllUsers() {
    await this.model.deleteMany({}).exec();
  }

  async banUser(id: string, data: OptionalKey<BanInfo, 'banDate'>) {
    const banInfo: BanInfo = {
      isBanned: data.isBanned,
      banReason: data.isBanned ? data.banReason : null,
      banDate: data.isBanned ? data.banDate : null,
    };

    const user = await this.model
      .findByIdAndUpdate(id, {
        banInfo,
      })
      .lean()
      .exec();

    console.log(user, 'user');
    if (!user) return null;

    return true;
  }
}
