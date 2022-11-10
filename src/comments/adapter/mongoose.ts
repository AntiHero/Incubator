import mongoose, { Types } from 'mongoose';
import { Injectable } from '@nestjs/common';

import { PaginationQuery } from 'root/_common/types';
import { countSkip } from 'root/_common/utils/countSkip';
import { convertToCommentDTO } from 'root/comments/utils/convertToCommentDTO';
import {
  CommentDatabaseModel,
  CommentDomainModel,
  CommentExtendedLikesDTO,
  CommentLeanModel,
  CommentSchemaModel,
} from '../types';
import { InjectModel } from '@nestjs/mongoose';
import { LikeStatuses } from 'root/_common/types/enum';

@Injectable()
export class CommentsAdapter {
  constructor(
    @InjectModel('comment') private model: mongoose.Model<CommentSchemaModel>,
  ) {}

  async getAllComments() {
    const docs = await this.model.find<CommentDatabaseModel>({}).lean();

    return docs.map((doc) => convertToCommentDTO(doc));
  }

  async findCommentById(id: string | Types.ObjectId) {
    const doc = await this.model
      .findOne<CommentDatabaseModel>({
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
    const comment = await this.model
      .findById<CommentLeanModel>(id)
      .lean()
      .populate('likes');

    if (!comment) return null;

    const likesCount = comment.likes.filter(
      (like) => like.likeStatus === LikeStatuses.Like,
    ).length;

    const dislikesCount = comment.likes.filter(
      (like) => like.likeStatus === LikeStatuses.Dislike,
    ).length;

    const userStatus =
      comment.likes.find((like) => String(like.userId) === userId)
        ?.likeStatus || LikeStatuses.None;

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

    return comments.map((comment) => convertToCommentDTO(comment));
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
