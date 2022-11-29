import mongoose, { Types } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { BlogModel } from 'root/blogs/schemas/blogs.schema';
import { UserModel } from 'root/users/schema/users.schema';
import { BannedUserEntity } from './entity/banned-user.entity';

@Injectable()
export class BanUsersForBlogService {
  constructor(
    @InjectModel(BlogModel)
    private readonly model: mongoose.Model<BlogModel>,
    @InjectModel(UserModel)
    private readonly userModel: mongoose.Model<UserModel>,
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

    if (!isBanned) {
      await this.model
        .findOneAndUpdate(
          {
            _id: new Types.ObjectId(blogId),
            bannedUsers: {
              userId: new Types.ObjectId(userId),
            },
          },
          {
            $pull: {
              bannedUsers: { userId: new Types.ObjectId(userId) },
            },
          },
        )
        .lean()
        .exec();
    } else {
      const bannedUser = new BannedUserEntity({ userId, banReason, isBanned });

      await this.model.findOneAndUpdate(
        {
          _id: new Types.ObjectId(blogId),
          bannedUsers: {
            userId: new Types.ObjectId(userId),
          },
        },
        {
          $push: {
            bannedUsers: bannedUser,
          },
        },
      );
    }

    return true;
  }
}
