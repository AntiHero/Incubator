import { Injectable } from '@nestjs/common';
import { defaultPaginationQuery } from 'root/_common/constants';
import { PaginationQuery } from 'root/_common/types';
import { BlogsAdapter } from './adapter/mongoose';
import { BlogDomainModel } from './types';

@Injectable()
export class BlogsService {
  constructor(private blogsRepository: BlogsAdapter) {}

  async saveBlog(blog: BlogDomainModel) {
    return this.blogsRepository.addBlog(blog);
  }

  async findBlogPostsByQuery(
    id: string,
    query: PaginationQuery = defaultPaginationQuery,
  ) {
    const posts = await this.blogsRepository.findBlogPostsByQuery(id, query);

    return posts;
  }

  async findBlogsByQuery(query: PaginationQuery = defaultPaginationQuery) {
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

  async addBlogPost(id: string, postToAddId: string) {
    return this.blogsRepository.addBlogPost(id, postToAddId);
  }
}
