import mongoose, { Types } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';

import { BannedUserForEntityDTO } from './types';
import { PaginationQuery } from 'root/@common/types';
import { countSkip } from 'root/@common/utils/count-skip';
import { BlogModel } from 'root/blogs/schemas/blogs.schema';
import { UserModel } from 'root/users/schema/users.schema';
import { BannedUserEntity } from './entity/banned-user.entity';
import { convertToBannedUserDTO } from './utils/convertToBannedUserDTO';
import { BannedUserForEntityModel } from './schemas/banned-user-for-entity.schema';

@Injectable()
export class BanUsersForBlogService {
  constructor(
    @InjectModel(BlogModel)
    private readonly model: mongoose.Model<BlogModel>,
    @InjectModel(UserModel)
    private readonly userModel: mongoose.Model<UserModel>,
    @InjectModel(BannedUserForEntityModel)
    private readonly bannedUserForEntityModel: mongoose.Model<BannedUserForEntityModel>,
  ) {}

  async banUser(
    userId: string,
    blogId: string,
    isBanned: boolean,
    banReason: string | null,
  ) {
    const user = await this.userModel.findById(userId).exec();
    const blog = await this.model.findById(blogId).exec();

    if (!user || !blog) return null;

    if (isBanned) {
      try {
        await this.bannedUserForEntityModel
          .findOneAndUpdate(
            {
              user: new Types.ObjectId(userId),
              entityId: new Types.ObjectId(blogId),
            },
            {
              ...new BannedUserEntity({
                user: userId,
                entityId: blogId,
                banReason,
                isBanned,
              }),
            },
            {
              upsert: true,
            },
          )
          .exec();
      } catch (error) {
        console.error(error);

        throw new Error('Something went wrong');
      }
    } else {
      try {
        await this.bannedUserForEntityModel.findOneAndDelete({
          user: new Types.ObjectId(userId),
          entityId: new Types.ObjectId(blogId),
        });
      } catch (error) {
        console.error(error);

        throw new Error('Something went wrong');
      }
    }

    return true;
  }

  async findBannedUsersByQuery(
    blogId: string,
    query: PaginationQuery,
  ): Promise<[BannedUserForEntityDTO[], any]> {
    const count = await this.bannedUserForEntityModel
      .find({
        entityId: new Types.ObjectId(blogId),
      })
      .populate({
        path: 'user',
        match: { login: { $regex: query.searchLoginTerm } },
      })
      .count();

    const bannedUsers = await this.bannedUserForEntityModel
      .find({
        entityId: new Types.ObjectId(blogId),
      })
      .lean()
      .populate({
        path: 'user',
        match: { login: { $regex: query.searchLoginTerm } },
      })
      .sort({ [`user.${query.sortBy}`]: query.sortDirection })
      .skip(countSkip(query.pageSize, query.pageNumber))
      .limit(query.pageSize)
      .lean()
      .exec();

    return [bannedUsers.map(convertToBannedUserDTO), count];
  }

  async deleteAll() {
    await this.bannedUserForEntityModel.deleteMany({});
  }
}
