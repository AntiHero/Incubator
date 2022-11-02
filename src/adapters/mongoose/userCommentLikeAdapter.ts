import { UserCommentLike } from '@/@types';
import { convertToUserCommentLike } from '@/utils/convertToUserCommentLike';
import mongoose, { Types, HydratedDocument } from 'mongoose';

import { UserCommentLikeDB } from './types';

export class UserCommentLikeMongooseAdapter {
  constructor(private Model: mongoose.Model<UserCommentLikeDB>) {
    this.Model = Model;
  }

  async getUserCommentLike(userId: string, commentId: string) {
    try {
      const userCommentLike = await this.Model.findOne<
        HydratedDocument<UserCommentLikeDB>
      >({
        userId: new Types.ObjectId(userId),
        commentId: new Types.ObjectId(commentId),
      }).exec();

      if (userCommentLike) {
        return convertToUserCommentLike(userCommentLike);
      }
    } catch (e) {
      console.error(e);
    }

    return null;
  }

  async getUserCommentLikeStatus(userId: string, commentId: string) {
    try {
      const userCommentLike = await this.Model.findOne<
        HydratedDocument<UserCommentLikeDB>
      >({
        userId: new Types.ObjectId(userId),
        commentId: new Types.ObjectId(commentId),
      }).exec();

      if (userCommentLike) {
        return userCommentLike.likeStatus;
      }
    } catch (e) {
      console.error(e);
    }

    return null;
  }

  async deleteUserCommentLikeById(id: string) {
    try {
      const removedId = await this.Model.findByIdAndDelete(id, {
        projection: { _id: 1 },
      });

      return removedId;
    } catch (e) {
      return null;
    }
  }

  async createUserCommentLike(payload: Omit<UserCommentLike, 'id'>) {
    try {
      return this.Model.create({
        ...payload,
        userId: new Types.ObjectId(payload.userId),
        commentId: new Types.ObjectId(payload.commentId),
      });
    } catch (e) {
      return null;
    }
  }
}
