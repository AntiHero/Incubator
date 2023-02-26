import mongoose, { Types } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';

import { PaginationQuery } from 'root/@core/types';
import { countSkip } from 'root/@core/utils/count-skip';
import { BannedUserForEntityDTO } from 'root/bloggers/@common/types';
import { convertToBannedUserDTO } from 'root/bloggers/@common/utils/convertToBannedUserDTO';
import { BannedUserEntity } from 'root/bloggers/infrastructure/database/entities/banned-user.model';
import { BannedUserForEntityModel } from '../../infrastructure/database/schemas/banned-user-for-entity.schema';

@Injectable()
export class BanUsersForBlogService {
  constructor(
    @InjectModel(BannedUserForEntityModel)
    private readonly bannedUserForEntityModel: mongoose.Model<BannedUserForEntityModel>,
  ) {}

  async banUser(
    userId: string,
    blogId: string,
    isBanned: boolean,
    banReason: string | null,
  ) {
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

  async findBannedUser(id: string, entityId: string) {
    return this.bannedUserForEntityModel
      .findOne({
        entityId: new Types.ObjectId(entityId),
        user: new Types.ObjectId(id),
      })
      .lean()
      .exec();
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
      .aggregate([
        {
          $match: {
            entityId: new Types.ObjectId(blogId),
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'user',
            foreignField: '_id',
            as: 'bannedUsers',
          },
        },

        {
          $unwind: '$bannedUsers',
        },
        {
          $replaceRoot: {
            newRoot: { $mergeObjects: ['$$ROOT', '$bannedUsers'] },
          },
        },
        {
          $project: { bannedUsers: 0 },
        },
        {
          $match: { login: { $regex: query.searchLoginTerm } },
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
        {
          $project: {
            banDate: 1,
            banReason: 1,
            isBanned: 1,
            entityId: 1,
            login: 1,
            _id: 1,
          },
        },
      ])
      .exec();

    return [bannedUsers.map(convertToBannedUserDTO), count];
  }

  async deleteAll() {
    await this.bannedUserForEntityModel.deleteMany({});
  }
}
