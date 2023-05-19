import { Injectable } from '@nestjs/common';

import { BlogsQueryRepository } from '../adapter/blogs-query.repository';
import { BlogsRepository } from '../adapter/blogs.repository';
import { PaginationQueryType } from 'root/@core/types';
import { PostDomainModel } from 'root/posts/types';
import { Roles } from 'root/users/types/roles';
import { BlogDomainModel } from '../types';

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

  async subscribe(blogId: string, userId: string) {
    console.log(blogId, userId);
    return;
  }
}
