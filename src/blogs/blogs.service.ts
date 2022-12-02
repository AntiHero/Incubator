import { Injectable } from '@nestjs/common';

import { BlogDomainModel } from './types';
import { BlogsAdapter } from './adapter/mongoose';
import { PaginationQuery } from 'root/@common/types';
import { PostDomainModel } from 'root/posts/types';
import { Roles } from 'root/users/types/roles';

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

  async findBlogsByQuery(query: PaginationQuery, forRole?: Roles) {
    return this.blogsRepository.findBlogsByQuery(query, forRole);
  }

  async getAllBlogs() {
    return this.blogsRepository.getAllBlogs();
  }

  async findBlogById(id: string, forUser?: Roles) {
    return this.blogsRepository.findBlogById(id, forUser);
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

  async banBlog(id: string, banStatus: boolean) {
    return this.blogsRepository.banBlog(id, banStatus);
  }

  async getAllComments(userId: string, query: PaginationQuery) {
    return this.blogsRepository.getAllComments(userId, query);
  }
}
