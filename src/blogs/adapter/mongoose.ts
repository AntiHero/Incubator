import { Injectable } from '@nestjs/common';
import mongoose, { Types } from 'mongoose';

import { InjectModel } from 'nestjs-typegoose';
import { CommentModel } from 'root/comments/schemas/comment.schema';

import { BlogModel } from '../schemas/blogs.schema';
import { PaginationQuery } from 'root/@common/types';
import { BlogDomainModel, BlogDTO } from '../types';
import { countSkip } from 'root/@common/utils/countSkip';
import { toObjectId } from 'root/@common/utils/toObjectId';
import { PostModel } from 'root/posts/schemas/post.schema';
import { PostDomainModel, PostExtendedLikesDTO } from 'root/posts/types';
import { LikeModel } from 'root/likes/schemas/likes.schema';
import { convertToBlogDTO } from '../utils/convertToBlogDTO';
import { convertToPostDTO } from 'root/posts/utils/convertToPostDTO';
import { LikeStatuses } from 'root/@common/types/enum';
import { convertToLikeDTO } from 'root/likes/utils/convertToLikeDTO';
import { LIKES_LIMIT } from 'root/@common/constants';

@Injectable()
export class BlogsAdapter {
  constructor(
    @InjectModel(BlogModel)
    private model: mongoose.Model<BlogModel>,
    @InjectModel(PostModel)
    private postModel: mongoose.Model<PostModel>,
    @InjectModel(CommentModel)
    private commentModel: mongoose.Model<CommentModel>,
    @InjectModel(LikeModel)
    private likeModel: mongoose.Model<LikeModel>,
  ) {}

  async getAllBlogs() {
    try {
      const blogs = await this.model.find({}).lean();
      return blogs.map(convertToBlogDTO);
    } catch (e) {
      return null;
    }
  }

  async addBlog(blog: BlogDomainModel) {
    try {
      const createdBlog = await this.model.create(blog);
      return convertToBlogDTO(createdBlog);
    } catch (e) {
      console.error(e);

      return null;
    }
  }

  async findBlogById(id: string) {
    try {
      const blog = await this.model.findById(id).lean();

      return convertToBlogDTO(blog);
    } catch (e) {
      return null;
    }
  }

  async findBlogByIdAndUpdate(id: string, updates: Partial<BlogDomainModel>) {
    try {
      const blog = await this.model
        .findByIdAndUpdate(id, updates, { new: true })
        .lean();

      if (!blog) return null;

      return convertToBlogDTO(blog);
    } catch (e) {
      console.error(e);

      return null;
    }
  }

  async findBlogByIdAndDelete(id: string) {
    await this.likeModel.deleteMany({ entityId: toObjectId(id) }).exec();
    await this.commentModel.deleteMany({ entityId: toObjectId(id) }).exec();
    await this.postModel.deleteMany({ blogId: toObjectId(id) });

    return this.model.findByIdAndDelete(id).lean();
  }

  async deleteAllBlogs() {
    await this.likeModel.deleteMany({}).exec();
    await this.commentModel.deleteMany({}).exec();
    await this.postModel.deleteMany({}).exec();
    await this.model.deleteMany({}).exec();
  }

  async countBlogPosts(id: string) {
    const blog = await this.model.findById(id).populate('posts').lean();

    if (!blog) return null;

    return blog.posts.length;
  }

  async findBlogPostsByQuery(
    id: string,
    query: PaginationQuery,
    userId = '',
  ): Promise<[PostExtendedLikesDTO[], number]> {
    try {
      const count = (await this.model.findById(id))?.posts.length ?? 0;

      const posts = await this.model
        .aggregate([
          { $match: { _id: toObjectId(id) } },
          {
            $lookup: {
              from: 'posts',
              localField: 'posts',
              foreignField: '_id',
              as: 'blogPosts',
            },
          },
          {
            $project: { blogPosts: 1 },
          },
          {
            $unwind: '$blogPosts',
          },
          {
            $replaceRoot: {
              newRoot: { $mergeObjects: ['$$ROOT', '$blogPosts'] },
            },
          },
          {
            $project: { blogPosts: 0 },
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

      if (!posts) return null;

      await this.likeModel.populate(posts, { path: 'likes' });

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

        const newestLikes = post.likes
          .filter((like) => {
            if (like instanceof Types.ObjectId)
              throw new Error('Not populated');

            return like.likeStatus === LikeStatuses.Like;
          })
          .sort((a, b) => {
            if (a instanceof Types.ObjectId || b instanceof Types.ObjectId)
              throw new Error('Not populated');

            return (
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
          });

        newestLikes.splice(LIKES_LIMIT);

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

  async findBlogsByQuery(query: PaginationQuery): Promise<[BlogDTO[], number]> {
    try {
      const filter = { name: { $regex: query.searchNameTerm } };
      const count = await this.model.find(filter).count();
      const blogs = await this.model
        .aggregate([
          {
            $match: filter,
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

      if (!blogs) return null;

      return [blogs.map(convertToBlogDTO), count];
    } catch (e) {
      return null;
    }
  }

  async addBlogPost(id: string, post: PostDomainModel) {
    const createdPost = await this.postModel.create({
      ...post,
      blogId: new Types.ObjectId(post.blogId),
    });

    const blog = await this.model.findByIdAndUpdate(id, {
      $push: { posts: createdPost._id },
    });

    if (!blog) return null;

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
}
