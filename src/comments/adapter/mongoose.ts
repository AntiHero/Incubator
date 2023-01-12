import { ObjectId } from 'mongodb';
import mongoose, { Types } from 'mongoose';
import { Injectable } from '@nestjs/common';

import { UserDTO } from 'root/users/types';
import { LikeDTO } from 'root/likes/types';
import { InjectModel } from 'nestjs-typegoose';
import { PaginationQuery } from 'root/@common/types';
import { Like } from 'root/likes/domain/likes.model';
import { LikeStatuses } from 'root/@common/types/enum';
import { CommentModel } from '../schemas/comment.schema';
import { countSkip } from 'root/@common/utils/count-skip';
import { LikeModel } from 'root/likes/schemas/likes.schema';
import { CommentDomainModel, CommentExtendedLikesDTO } from '../types';
import { convertToCommentDTO } from 'root/comments/utils/convertToCommentDTO';

@Injectable()
export class CommentsAdapter {
  constructor(
    @InjectModel(CommentModel)
    private model: mongoose.Model<CommentModel>,
    @InjectModel(LikeModel)
    private likeModel: mongoose.Model<LikeModel>,
  ) {}

  async getAllComments() {
    const docs = await this.model.find({}).lean();

    return docs.map((doc) => convertToCommentDTO(doc));
  }

  async likeComment(id: string, data: Partial<LikeDTO>) {
    try {
      if (!ObjectId.isValid(id) || !ObjectId.isValid(data.userId))
        throw new Error('Not valid post id');

      const filter = {
        entityId: new Types.ObjectId(id),
        userId: new Types.ObjectId(data.userId),
      };

      const like = await this.likeModel.findOne(filter).exec();

      if (!like) {
        const { login, likeStatus, userId } = data;

        if (likeStatus === LikeStatuses.None) return true;

        const newLike = new Like({ login, entityId: id, likeStatus, userId });

        const createdLike = await this.likeModel.create(newLike);

        await this.model.findByIdAndUpdate(id, {
          $push: { likes: createdLike._id },
        });

        return true;
      } else {
        if (data.likeStatus === LikeStatuses.None) {
          await this.model
            .findByIdAndUpdate(id, {
              $pull: { likes: like._id },
            })
            .exec();

          await this.likeModel.findByIdAndDelete(like._id).exec();
        } else {
          await this.likeModel.updateOne({ _id: like._id }, data).exec();
        }

        return true;
      }
    } catch (e) {
      console.log('error');
      return null;
    }
  }

  async findCommentById(id: string | Types.ObjectId) {
    const doc = await this.model
      .findOne({
        _id: typeof id === 'string' ? new Types.ObjectId(id) : id,
      })
      .lean();

    if (!doc) return null;

    return convertToCommentDTO(doc);
  }

  async addComment(entityId: string, comment: CommentDomainModel) {
    try {
      const doc = await this.model.create({
        ...comment,
        userId: new Types.ObjectId(comment.userId),
        entityId: new Types.ObjectId(entityId),
      });

      return convertToCommentDTO(doc);
    } catch (e) {
      return null;
    }
  }

  async countComments(entityId: string) {
    const count = await this.model
      .find({ entityId: new Types.ObjectId(entityId) })
      .count();

    return count;
  }

  async getExtendedCommentInfo(id: string, userId = '') {
    const comment = await this.model.findById(id).lean().populate('likes');

    if (!comment || comment.isBanned) return null;

    const likesCount = comment.likes.filter((like) => {
      if (like instanceof Types.ObjectId) throw new Error('Not populated');

      return like.likeStatus === LikeStatuses.Like && !like.isBanned;
    }).length;

    const dislikesCount = comment.likes.filter((like) => {
      if (like instanceof Types.ObjectId) throw new Error('Not populated');

      return like.likeStatus === LikeStatuses.Dislike && !like.isBanned;
    }).length;

    let userStatus: LikeStatuses;

    const status = comment.likes.find((like) => {
      if (like instanceof Types.ObjectId) throw new Error('Not populated');

      return String(like.userId) === userId;
    });

    if (status && 'likeStatus' in status) {
      userStatus = status.likeStatus;
    } else {
      userStatus = LikeStatuses.None;
    }

    const convertedComment = convertToCommentDTO(comment);

    delete convertedComment.likes;

    const extendedComment: CommentExtendedLikesDTO = {
      ...convertedComment,
      likesCount,
      dislikesCount,
      userStatus,
    };

    return extendedComment;
  }

  async findCommentsByQuery(query: PaginationQuery, entityId?: string) {
    const comments = await this.model
      .find(entityId ? { entityId: new Types.ObjectId(entityId) } : {})
      .sort({ [query.sortBy]: query.sortDirection })
      .skip(countSkip(query.pageSize, query.pageNumber))
      .limit(query.pageSize)
      .lean()
      .populate('likes');

    return comments.map(convertToCommentDTO);
  }

  async findCommentByIdAndDelete(id: string) {
    const result = await this.model
      .findOneAndRemove({ _id: new Types.ObjectId(id) })
      .lean();

    if (result) return true;

    return null;
  }

  async findCommentByIdAndUpdate(
    id: string,
    updates: Partial<CommentDomainModel>,
  ) {
    try {
      const result = await this.model.findByIdAndUpdate(id, updates).lean();

      if (result) return true;
    } catch (e) {
      console.error(e);
    }

    return null;
  }

  async updateComments(userId: string, update: Partial<UserDTO>) {
    return this.model.updateMany(
      // { userId: new Types.ObjectId(userId) },
      { userId },
      update,
    );
  }

  async deleteAllComments() {
    await this.model.deleteMany({}).exec();
  }
}
