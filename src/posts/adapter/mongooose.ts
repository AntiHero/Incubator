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
  PostInputModel,
  PostSchemaModel,
} from '../types';

@Injectable()
export class PostsAdapter {
  constructor(
    @InjectModel('post') private model: mongoose.Model<PostSchemaModel>,
  ) {}

  async getAllPosts() {
    const posts = await this.model
      .find<PostDatabaseModel>({})
      .populate('comment')
      .lean();

    return posts.map((post) => convertToPostDTO(post, true));
  }

  async createPost(post: PostDomainModel) {
    const createdPost = await this.model.create({
      ...post,
      blogId: new ObjectId(post.blogId),
      createdAt: new Date(),
    });

    return convertToPostDTO(createdPost);
  }

  async findPostById(postId: string) {
    const doc = await this.model
      .findById<PostDatabaseModel>(postId)
      .populate('comment')
      .lean();

    if (!doc) return null;

    return convertToPostDTO(doc, true);
  }

  async findPostByIdAndUpdate(
    id: string,
    { content, title, shortDescription, blogId }: PostInputModel,
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
    return this.model.findByIdAndRemove(id).lean();
  }

  async countPosts() {
    const count = await this.model.find<PostDatabaseModel>().count();

    return count;
  }

  async findPostsByQuery(query: PaginationQuery, filter: any = {}) {
    const posts = await this.model
      .find(...filter)
      .sort({ [query.sortBy]: query.sortDirection })
      .skip(countSkip(query.pageSize, query.pageNumber))
      .limit(query.pageSize)
      .populate('comment')
      .lean();

    return posts.map((post) => convertToPostDTO(post, true));
  }

  async deleteAllPosts() {
    await this.model.deleteMany({}).exec();
  }
}
