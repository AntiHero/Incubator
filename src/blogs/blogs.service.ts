import { Injectable } from '@nestjs/common';

import { BlogDomainModel } from './types';
import { BlogsAdapter } from './adapter/mongoose';
import { PaginationQuery } from 'root/@common/types';
import { PostDomainModel } from 'root/posts/types';

@Injectable()
export class BlogsService {
  constructor(private blogsRepository: BlogsAdapter) {}

  async saveBlog(blog: BlogDomainModel) {
    return this.blogsRepository.addBlog(blog);
  }

  async findBlogPostsByQuery(
    id: string,
    query: PaginationQuery,
    userId?: string,
  ) {
    return this.blogsRepository.findBlogPostsByQuery(id, query, userId);
  }

  async findUserBlogsByQuery(userId: string, query: PaginationQuery) {
    return this.blogsRepository.findUserBlogsByQuery(userId, query);
  }

  async findBlogsByQuery(query: PaginationQuery) {
    return this.blogsRepository.findBlogsByQuery(query);
  }

  async getAllBlogs() {
    return this.blogsRepository.getAllBlogs();
  }

  async findBlogById(id: string) {
    return this.blogsRepository.findBlogById(id);
  }

  async findBlogByIdAndUpate(id: string, update: Partial<BlogDomainModel>) {
    return this.blogsRepository.findBlogByIdAndUpdate(id, update);
  }

  async findBlogByIdAndDelete(id: string) {
    return this.blogsRepository.findBlogByIdAndDelete(id);
  }

  async deleteAllBlogs() {
    await this.blogsRepository.deleteAllBlogs();
  }

  async addBlogPost(id: string, post: PostDomainModel) {
    return this.blogsRepository.addBlogPost(id, post);
  }
}
