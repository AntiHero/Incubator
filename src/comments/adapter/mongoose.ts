import mongoose, { Types } from 'mongoose';
import { Injectable } from '@nestjs/common';

import { InjectModel } from 'nestjs-typegoose';
import { PaginationQuery } from 'root/@common/types';
import { LikeStatuses } from 'root/@common/types/enum';
import { CommentModel } from '../schemas/comment.schema';
import { countSkip } from 'root/@common/utils/countSkip';
import { CommentDomainModel, CommentExtendedLikesDTO } from '../types';
import { convertToCommentDTO } from 'root/comments/utils/convertToCommentDTO';

@Injectable()
export class CommentsAdapter {
  constructor(
    @InjectModel(CommentModel)
    private model: mongoose.Model<CommentModel>,
  ) {}

  async getAllComments() {
    const docs = await this.model.find({}).lean();

    return docs.map((doc) => convertToCommentDTO(doc));
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

    if (!comment) return null;

    const likesCount = comment.likes.filter((like) => {
      if (like instanceof Types.ObjectId) throw new Error('Not populated');

      return like.likeStatus === LikeStatuses.Like;
    }).length;

    const dislikesCount = comment.likes.filter((like) => {
      if (like instanceof Types.ObjectId) throw new Error('Not populated');

      return like.likeStatus === LikeStatuses.Dislike;
    }).length;

    let userStatus: LikeStatuses;

    const status = comment.likes.find((like) => {
      if (like instanceof Types.ObjectId) throw new Error('Not populated');

      return String(like.userId) === userId;
    });

    if ('likeStatus' in status) {
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

  async deleteAllComments() {
    await this.model.deleteMany({}).exec();
  }
}
