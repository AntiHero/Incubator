import { ObjectId } from 'mongodb';
import mongoose, { Types } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';

import { PaginationQuery } from 'root/@common/types';
import { countSkip } from 'root/@common/utils/countSkip';
import { convertToPostDTO } from '../utils/convertToPostDTO';
import {
  PostDatabaseModel,
  PostDomainModel,
  PostDTO,
  PostExtendedLikesDTO,
  PostLeanModel,
} from '../types';
import { PostModel } from '../schemas/post.schema';
import { LikeDomainModel } from 'root/likes/types';
import { Like } from 'root/likes/domain/likes.model';
import { LikeStatuses } from 'root/@common/types/enum';
import { toObjectId } from 'root/@common/utils/toObjectId';
import { BlogModel } from 'root/blogs/schemas/blogs.schema';
import { LikeModel } from 'root/likes/schemas/likes.schema';
import { CommentExtendedLikesDTO } from 'root/comments/types';
import { CommentModel } from 'root/comments/schemas/comment.schema';
import { convertToLikeDTO } from 'root/likes/utils/convertToLikeDTO';
import { convertToCommentDTO } from 'root/comments/utils/convertToCommentDTO';

@Injectable()
export class PostsAdapter {
  constructor(
    @InjectModel(PostModel)
    private model: mongoose.Model<PostModel>,
    @InjectModel(BlogModel)
    private blogModel: mongoose.Model<BlogModel>,
    @InjectModel(CommentModel)
    private commentModel: mongoose.Model<CommentModel>,
    @InjectModel(LikeModel)
    private likeModel: mongoose.Model<LikeModel>,
  ) {}

  async getAllPosts() {
    const posts = await this.model
      .find<PostDatabaseModel>({})
      .populate('comments')
      .lean();

    return posts.map(convertToPostDTO);
  }

  async addPost(post: PostDomainModel) {
    const blog = await this.blogModel.findById(post.blogId).lean();

    if (!blog) return null;

    const createdPost = await this.model.create({
      ...post,
      blogName: post.blogName || blog.name,
      blogId: new ObjectId(post.blogId),
    });

    const convertedPost = convertToPostDTO(createdPost);

    const extendedPost: PostExtendedLikesDTO = {
      ...convertedPost,
      likesCount: 0,
      dislikesCount: 0,
      userStatus: LikeStatuses.None,
      newestLikes: [],
    };

    return extendedPost;
  }

  async findPostById(postId: string) {
    const doc = await this.model
      .findById(postId)
      .lean()
      .populate('comments')
      .populate('likes');

    if (!doc) return null;

    return convertToPostDTO(doc);
  }

  async findPostByIdAndUpdate(
    id: string,
    { content, title, shortDescription, blogId }: Partial<PostDomainModel>,
  ) {
    const update = { content, title, shortDescription, blogId };

    try {
      const updatedPost = await this.model
        .findByIdAndUpdate(id, update, {
          new: true,
        })
        .lean();

      return updatedPost ? convertToPostDTO(updatedPost) : null;
    } catch (e) {
      console.error(e);

      return null;
    }
  }

  async findPostByIdAndDelete(id: string) {
    await this.commentModel.deleteMany({ entityId: toObjectId(id) }).exec();
    await this.likeModel.deleteMany({ entityId: toObjectId(id) }).exec();

    return this.model.findByIdAndRemove(id).lean();
  }

  async likePost(id: string, data: Partial<LikeDomainModel>) {
    try {
      const isValidPostId = ObjectId.isValid(id);

      if (!isValidPostId) throw new Error('Not valid post id');

      const filter: any = { entityId: new Types.ObjectId(id) };

      if (data.userId) {
        filter.userId = new Types.ObjectId(data.userId);
      }

      const like = await this.likeModel.findOne(filter).exec();

      if (!like) {
        const {
          login,
          entityId = id,
          likeStatus = LikeStatuses.None,
          userId,
        } = data;
        if (likeStatus === LikeStatuses.None) return true;

        const newLike = new Like({ login, entityId, likeStatus, userId });

        const createdLike = await this.likeModel.create(newLike);

        await this.model.findByIdAndUpdate(id, {
          $push: { likes: createdLike._id },
        });

        return true;
      } else {
        if (data.likeStatus === LikeStatuses.None) {
          await this.model.findByIdAndUpdate(id, {
            $pull: { likes: like._id },
          });
        } else {
          await this.likeModel.updateOne({ _id: like._id }, data).exec();
        }

        return true;
      }
    } catch (e) {
      return null;
    }
  }

  async countPosts() {
    const count = await this.model.find<PostDatabaseModel>().count();

    return count;
  }

  async getExtendedPostInfo(id: string, userId = '') {
    try {
      const post = await this.model.findById(id).lean().populate('likes');

      if (!post) return null;

      const likesCount = post.likes.filter((like) => {
        if (like instanceof Types.ObjectId) throw new Error('Not populated');

        return like.likeStatus === LikeStatuses.Like;
      }).length;

      const dislikesCount = post.likes.filter((like) => {
        if (like instanceof Types.ObjectId) throw new Error('Not populated');

        return like.likeStatus === LikeStatuses.Dislike;
      }).length;

      let userStatus: LikeStatuses;

      const status = post.likes.find((like) => {
        if (like instanceof Types.ObjectId) throw new Error('Not populated');
        return String(like.userId) === userId;
      });

      if (status && 'likeStatus' in status) {
        userStatus = status.likeStatus;
      } else {
        userStatus = LikeStatuses.None;
      }

      const convertedPost = convertToPostDTO(post);

      delete convertedPost.likes;
      delete convertedPost.comments;

      const newestLikes = post.likes
        .filter((like) => {
          if (like instanceof Types.ObjectId) throw new Error('Not populated');

          return like.likeStatus === LikeStatuses.Like;
        })
        .sort((a, b) => {
          if (a instanceof Types.ObjectId || b instanceof Types.ObjectId)
            throw new Error('Not populated');

          return a.createdAt
            .toISOString()
            .localeCompare(b.createdAt.toISOString());
        });

      const extendedPost: PostExtendedLikesDTO = {
        ...convertedPost,
        likesCount,
        dislikesCount,
        userStatus,
        newestLikes: newestLikes.map(convertToLikeDTO),
      };

      return extendedPost;
    } catch (e) {
      console.error(e, 'extendedPost');

      return null;
    }
  }

  async getExtendedPostsInfoByQuery(
    query: PaginationQuery,
    filter: any,
    userId = '',
  ): Promise<[PostExtendedLikesDTO[], number]> {
    try {
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
        const likesCount = post.likes.filter((like) => {
          if (like instanceof Types.ObjectId) throw new Error('Not populated');

          return like.likeStatus === LikeStatuses.Like;
        }).length;

        const dislikesCount = post.likes.filter((like) => {
          if (like instanceof Types.ObjectId) throw new Error('Not populated');

          return like.likeStatus === LikeStatuses.Dislike;
        }).length;

        let userStatus: LikeStatuses;

        const status = post.likes.find((like) => {
          if (like instanceof Types.ObjectId) throw new Error('Not populated');

          return String(like.userId) === userId;
        });

        if (status && 'likeStatus' in status) {
          userStatus = status.likeStatus;
        } else {
          userStatus = LikeStatuses.None;
        }

        const convertedPost = convertToPostDTO(post);

        delete convertedPost.likes;
        delete convertedPost.comments;

        const newestLikes = post.likes.sort((a, b) => {
          if (a instanceof Types.ObjectId || b instanceof Types.ObjectId)
            throw new Error('Not populated');

          return a.createdAt
            .toISOString()
            .localeCompare(b.createdAt.toISOString());
        });

        newestLikes.splice(2);

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
    } catch (e) {
      console.error(e);

      return null;
    }
  }

  async findPostsByQuery(
    query: PaginationQuery,
    filter: any = {},
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

    return [posts.map(convertToPostDTO), count];
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
