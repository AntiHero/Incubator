import { Injectable } from '@nestjs/common';
import mongoose from 'mongoose';

import { InjectModel } from '@nestjs/mongoose';

import { CommentSchemaModel } from 'root/comments/types';
import { LikeSchemaModel } from 'root/likes/types';
import { PostDomainModel, PostDTO, PostSchemaModel } from 'root/posts/types';
import { convertToPostDTO } from 'root/posts/utils/convertToPostDTO';
import { PaginationQuery } from 'root/_common/types';
import { countSkip } from 'root/_common/utils/countSkip';
import { toObjectId } from 'root/_common/utils/toObjectId';
import {
  BlogDatabaseModel,
  BlogDomainModel,
  BlogDTO,
  BlogSchemaModel,
} from '../types';
import { convertToBlogDTO } from '../utils/convertToBlogDTO';

@Injectable()
export class BlogsAdapter {
  constructor(
    @InjectModel('blog') private model: mongoose.Model<BlogSchemaModel>,
    @InjectModel('post') private postModel: mongoose.Model<PostSchemaModel>,
    @InjectModel('comment')
    private commentModel: mongoose.Model<CommentSchemaModel>,
    @InjectModel('like') private likeModel: mongoose.Model<LikeSchemaModel>,
  ) {}

  async getAllBlogs() {
    try {
      const blogs = await this.model.find<BlogDatabaseModel>({}).lean();

      return blogs.map((blog) => convertToBlogDTO(blog, false));
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
      const blog = await this.model.findById<BlogDatabaseModel>(id).lean();

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
    await this.postModel.deleteMany({}).exec();
    await this.postModel.deleteMany({}).exec();
    await this.model.deleteMany({}).exec();
  }

  async countBlogPosts(id: string) {
    const blog = await this.model
      .findById<BlogDatabaseModel>(id)
      .populate('posts')
      .lean();

    if (!blog) return null;

    return blog.posts.length;
  }

  async findBlogPostsByQuery(
    id: string,
    query: PaginationQuery,
  ): Promise<[PostDTO[], number]> {
    try {
      const count =
        (await this.model.findById<BlogDatabaseModel>(id))?.posts.length ?? 0;

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

      return [posts.map((post) => convertToPostDTO(post)), count];
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
        .aggregate<BlogDatabaseModel>([
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
      return [blogs.map((blog) => convertToBlogDTO(blog)), count];
    } catch (e) {
      return null;
    }
  }

  async addBlogPost(id: string, post: PostDomainModel) {
    const createdPost = await this.postModel.create(post);

    const blog = await this.model.findByIdAndUpdate<BlogDatabaseModel>(id, {
      $push: { posts: createdPost._id },
    });

    if (!blog) return null;

    return convertToPostDTO(createdPost);
  }
}
