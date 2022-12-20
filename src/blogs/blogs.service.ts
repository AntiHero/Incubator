import { Injectable } from '@nestjs/common';

import { BlogDomainModel } from './types';
import { Roles } from 'root/users/types/roles';
import { PostDomainModel } from 'root/posts/types';
import { PaginationQueryType } from 'root/@common/types';
import { BlogsRepository } from './adapter/blogs.repository';
import { BlogsQueryRepository } from './adapter/blogs-query.repository';

@Injectable()
export class BlogsService {
  constructor(
    private readonly blogsRepository: BlogsRepository,
    private readonly blogsQueryRepository: BlogsQueryRepository,
  ) {}

  async saveBlog(blog: BlogDomainModel) {
    return this.blogsRepository.addBlog(blog);
  }

  async findBlogPostsByQuery(
    id: string,
    query: PaginationQueryType,
    userId?: string,
  ) {
    return this.blogsQueryRepository.findBlogPostsByQuery(id, query, userId);
  }

  async findUserBlogsByQuery(userId: string, query: PaginationQueryType) {
    return this.blogsQueryRepository.findUserBlogsByQuery(userId, query);
  }

  async findBlogsByQuery(query: PaginationQueryType, forRole?: Roles) {
    return this.blogsQueryRepository.findBlogsByQuery(query, forRole);
  }

  async getAllBlogs() {
    return this.blogsQueryRepository.getAllBlogs();
  }

  async findBlogById(id: string, forUser?: Roles) {
    return this.blogsQueryRepository.findBlogById(id, forUser);
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

  async getAllComments(userId: string, query: PaginationQueryType) {
    return this.blogsQueryRepository.getAllComments(userId, query);
  }
}
