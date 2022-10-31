import mongoose, { Types, ObjectId, HydratedDocument } from 'mongoose';

import { UserFields } from '@/enums';
import UserModel from '@/models/User';
import { countSkip } from '@/utils/countSkip';
import { PaginationQuery, UserDBType, UserUpdatesType } from '@/@types';

export class UserMongooseAdapter {
  constructor(private Model: mongoose.Model<UserModel>) {
    this.Model = Model;
  }

  async createUser(user: UserModel): Promise<UserDBType | null> {
    try {
      const createdUser = this.Model.create(user);

      return createdUser;
    } catch (e) {
      return null;
    }
  }

  async findUserById(id: string | ObjectId) {
    return this.Model.findById<UserDBType>(
      typeof id === 'string' ? new Types.ObjectId(id) : id
    ).exec();
  }

  async findUserByIdAndUpate(
    id: string,
    updates: Partial<{ [K in UserUpdatesType]: any }>
  ) {
    const updatedUser = await this.Model.findByIdAndUpdate<UserDBType>(
      new Types.ObjectId(id),
      updates,
      {
        projection: '_id',
      }
    ).exec();

    return updatedUser ? true : null;
  }

  async findUserByIdAndDelete(id: string) {
    const deletedUser = await this.Model.findByIdAndDelete<UserDBType>(
      new Types.ObjectId(id),
      {
        projection: '_id',
      }
    ).exec();

    return deletedUser ? true : null;
  }

  async findUserByLogin(login: string) {
    return this.Model.findOne<UserDBType>({ login }).exec();
  }

  async findUserByLoginOrEmail(loginOrEmail: string) {
    const user = this.Model.findOne<UserDBType>({
      $or: [{ login: loginOrEmail }, { email: loginOrEmail }],
    });

    return user;
  }

  async getUsersCount(query: Partial<PaginationQuery>) {
    const counts = await this.Model.aggregate<{ totalCount: number }>([
      {
        $match: {
          $or: [
            { login: { $regex: query.searchLoginTerm } },
            { email: { $regex: query.searchEmailTerm } },
          ],
        },
      },
      {
        $count: 'totalCount',
      },
    ]).exec();

    return counts.length ? counts[0].totalCount : 0;
  }

  async findUsersByQuery(query: PaginationQuery) {
    const users = await this.Model.aggregate<UserDBType>([
      {
        $match: {
          $or: [
            { login: { $regex: query.searchLoginTerm } },
            { email: { $regex: query.searchEmailTerm } },
          ],
        },
      },
      {
        $sort: { [query.sortBy]: query.sortDirection },
      },
      {
        $skip: countSkip(query.pageSize, query.pageNumber),
      },
      {
        $limit: query.pageSize,
      },
    ]).exec();

    return users;
  }

  async findUserByRecoveryCode(code: string) {
    return this.Model.findOne<UserDBType>({
      [UserFields['passwordRecovery.code']]: code,
    }).exec();
  }

  async findUserByConfirmationCode(code: string) {
    return await this.Model.findOne<HydratedDocument<UserDBType>>({
      [UserFields['confirmationInfo.code']]: code,
    }).exec();
  }

  async deleteAll() {
    await this.Model.deleteMany({}).exec();
  }
}
