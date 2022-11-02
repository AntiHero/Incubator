import mongoose, { Types, HydratedDocument } from 'mongoose';

import { countSkip } from '@/utils/countSkip';
import {
  CommentModelType,
  CommentDBType,
  PaginationQuery,
  h06,
} from '@/@types';
import { convertToComment } from '@/utils/convertToComment';

export class CommentsMongooseAdapter {
  constructor(private Model: mongoose.Model<CommentDBType>) {
    this.Model = Model;
  }

  async getAllComments() {
    const docs = await this.Model.find<HydratedDocument<CommentDBType>>(
      {}
    ).exec();

    return docs.map((doc) => convertToComment(doc));
  }

  async findCommentById(id: string | Types.ObjectId) {
    const doc = await this.Model.findOne<HydratedDocument<CommentDBType>>({
      _id: typeof id === 'string' ? new Types.ObjectId(id) : id,
    });

    if (!doc) return null;

    return convertToComment(doc);
  }

  async saveComment(comment: CommentModelType, postId?: string) {
    try {
      const doc = await this.Model.create({
        ...comment,
        userId: new Types.ObjectId(comment.userId),
        postId: new Types.ObjectId(postId),
      });

      return convertToComment(doc);
    } catch (e) {
      return null;
    }
  }

  async getCommentsCount(postId: string) {
    const cursor = await this.Model.aggregate<{ totalCount: number }>([
      {
        $match: { postId: new Object(postId) },
      },
      {
        $count: 'totalCount',
      },
    ]).exec();

    return cursor.length ? cursor[0].totalCount : 0;
  }

  async findCommentsByQuery(query: PaginationQuery & { postId: string }) {
    const comments = await this.Model.aggregate<
      HydratedDocument<CommentDBType>
    >([
      {
        $match: { postId: new Object(query.postId) },
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

    return comments.map(convertToComment);
  }

  async findCommentByIdAndDelete(id: string) {
    const result = await this.Model.deleteOne({
      _id: new Types.ObjectId(id),
    }).exec();

    if (result.deletedCount === 1) return true;

    return null;
  }

  async updateCommentById(
    id: string,

    { content }: h06.CommentInputModel
  ) {
    const query = { _id: new Types.ObjectId(id) };
    const update = { $set: { content } };

    const result = await this.Model.updateOne(query, update).exec();

    if (result.modifiedCount === 1) return true;

    return null;
  }

  async findCommentByIdAndUpdate(id: string, updates: Partial<CommentDBType>) {
    try {
      const result = await this.Model.findByIdAndUpdate(
        new Types.ObjectId(id),
        updates
      ).exec();

      if (result) return true;
    } catch (e) {
      console.error(e);
    }

    return null;
  }
}
