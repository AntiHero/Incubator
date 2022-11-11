import mongoose from 'mongoose';
import { ObjectId } from 'mongodb';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { PaginationQuery } from 'root/_common/types';
import { countSkip } from 'root/_common/utils/countSkip';
import { convertToPostDTO } from '../utils/convertToPostDTO';
import {
  PostDatabaseModel,
  PostDomainModel,
  PostDTO,
  PostExtendedLikesDTO,
  PostLeanModel,
  PostSchemaModel,
} from '../types';
import { LikeSchemaModel } from 'root/likes/types';
import { LikeStatuses } from 'root/_common/types/enum';
import {
  CommentExtendedLikesDTO,
  CommentSchemaModel,
} from 'root/comments/types';
import { toObjectId } from 'root/_common/utils/toObjectId';
import { BlogLeanModel, BlogSchemaModel } from 'root/blogs/types';
import { convertToLikeDTO } from 'root/likes/utils/convertToLikeDTO';
import { convertToCommentDTO } from 'root/comments/utils/convertToCommentDTO';

@Injectable()
export class PostsAdapter {
  constructor(
    @InjectModel('post') private model: mongoose.Model<PostSchemaModel>,
    @InjectModel('blog') private blogModel: mongoose.Model<BlogSchemaModel>,
    @InjectModel('comment')
    private commentModel: mongoose.Model<CommentSchemaModel>,
    @InjectModel('like') private likeModel: mongoose.Model<LikeSchemaModel>,
  ) {}

  async getAllPosts() {
    const posts = await this.model
      .find<PostDatabaseModel>({})
      .populate('comments')
      .lean();

    return posts.map((post) => convertToPostDTO(post, true));
  }

  async addPost(post: PostDomainModel) {
    const blog = await this.blogModel
      .findById<BlogLeanModel>(post.blogId)
      .lean();

    if (!blog) return null;

    const createdPost = await this.model.create({
      ...post,
      blogName: post.blogName || blog.name,
      blogId: new ObjectId(post.blogId),
    });

    return convertToPostDTO(createdPost);
  }

  async findPostById(postId: string) {
    const doc = await this.model
      .findById<PostDatabaseModel>(postId)
      .lean()
      .populate('comments')
      .populate('likes');

    if (!doc) return null;

    return convertToPostDTO(doc, true);
  }

  async findPostByIdAndUpdate(
    id: string,
    { content, title, shortDescription, blogId }: Partial<PostDomainModel>,
  ) {
    const update = { content, title, shortDescription, blogId };

    const updatedPost = await this.model
      .findByIdAndUpdate<PostDatabaseModel>(id, update, {
        new: true,
      })
      .lean();

    return updatedPost ? convertToPostDTO(updatedPost) : null;
  }

  async findPostByIdAndDelete(id: string) {
    await this.commentModel.deleteMany({ entityId: toObjectId(id) }).exec();
    await this.likeModel.deleteMany({ entityId: toObjectId(id) }).exec();

    return this.model.findByIdAndRemove(id).lean();
  }

  async countPosts() {
    const count = await this.model.find<PostDatabaseModel>().count();

    return count;
  }

  async getExtendedPostInfo(id: string, userId = '') {
    const post = await this.model.findById(id).lean().populate('likes');

    if (!post) return null;

    const likesCount = post.likes.filter(
      (like) => like.likeStatus === LikeStatuses.Like,
    ).length;

    const dislikesCount = post.likes.filter(
      (like) => like.likeStatus === LikeStatuses.Dislike,
    ).length;

    const userStatus =
      post.likes.find((like) => String(like.userId) === userId)?.likeStatus ||
      LikeStatuses.None;

    const convertedPost = convertToPostDTO(post);

    delete convertedPost.likes;
    delete convertedPost.comments;

    const newestLikes = post.likes.sort((a, b) =>
      a.addedAt.toISOString().localeCompare(b.addedAt.toISOString()),
    );

    const extendedPost: PostExtendedLikesDTO = {
      ...convertedPost,
      likesCount,
      dislikesCount,
      userStatus,
      newestLikes: newestLikes.map(convertToLikeDTO),
    };

    return extendedPost;
  }

  async getExtendedPostsInfoByQuery(
    query: PaginationQuery,
    filter: any,
    userId = '',
  ): Promise<[PostExtendedLikesDTO[], number]> {
    const count = await this.model.find({ ...filter }).count();

    const posts = await this.model
      .find<PostLeanModel>({ ...filter })
      .sort({ [query.sortBy]: query.sortDirection })
      .skip(countSkip(query.pageSize, query.pageNumber))
      .limit(query.pageSize)
      .lean()
      .populate('likes');

    const result: PostExtendedLikesDTO[] = [];

    for (const post of posts) {
      const likesCount = post.likes.filter(
        (like) => like.likeStatus === LikeStatuses.Like,
      ).length;

      const dislikesCount = post.likes.filter(
        (like) => like.likeStatus === LikeStatuses.Dislike,
      ).length;

      const userStatus =
        post.likes.find((like) => String(like.userId) === userId)?.likeStatus ||
        LikeStatuses.None;

      const convertedPost = convertToPostDTO(post);

      delete convertedPost.likes;
      delete convertedPost.comments;

      const newestLikes = post.likes.sort((a, b) =>
        a.addedAt.toISOString().localeCompare(b.addedAt.toISOString()),
      );

      const extendedPost: PostExtendedLikesDTO = {
        ...convertedPost,
        likesCount,
        dislikesCount,
        userStatus,
        newestLikes: newestLikes.map(convertToLikeDTO),
      };
      result.push(extendedPost);
    }

    return [result, count];
  }

  async findPostsByQuery(
    query: PaginationQuery,
    filter: any = {},
    populate = false,
  ): Promise<[PostDTO[], number]> {
    const count = await this.model.find(...filter).count();

    const posts = await this.model
      .find({ ...filter })
      .sort({ [query.sortBy]: query.sortDirection })
      .skip(countSkip(query.pageSize, query.pageNumber))
      .limit(query.pageSize)
      .populate('comments')
      .populate('likes')
      .lean();

    return [posts.map((post) => convertToPostDTO(post, populate)), count];
  }

  async deleteAllPosts() {
    await this.commentModel.deleteMany({}).exec();
    await this.likeModel.deleteMany({}).exec();
    await this.model.deleteMany({}).exec();
  }

  async findPostCommentsByQuery(
    id: string,
    query: PaginationQuery,
    userId = '',
  ): Promise<[CommentExtendedLikesDTO[], number]> {
    try {
      const count =
        (await this.model.findById<PostDatabaseModel>(id))?.comments.length ??
        0;

      const comments = await this.model
        .aggregate([
          { $match: { _id: toObjectId(id) } },
          {
            $lookup: {
              from: 'comments',
              localField: 'comments',
              foreignField: '_id',
              as: 'postComments',
            },
          },
          {
            $project: { postComments: 1 },
          },
          {
            $unwind: '$postComments',
          },
          {
            $replaceRoot: {
              newRoot: { $mergeObjects: ['$postComments', '$$ROOT'] },
            },
          },
          {
            $project: { postComments: 0 },
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
        ])
        .exec();

      if (!comments) return null;

      const result: CommentExtendedLikesDTO[] = [];

      for (const comment of comments) {
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

        result.push(extendedComment);
      }

      return [result, count];
    } catch (e) {
      console.error(e);

      return null;
    }
  }
}
