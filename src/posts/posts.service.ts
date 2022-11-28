import { Injectable } from '@nestjs/common';

import { PostDomainModel } from './types';
import { PaginationQuery } from 'root/@common/types';
import { PostsAdapter } from './adapter/mongooose';
import { LikeDomainModel } from 'root/likes/types';
import { CommentDTO } from 'root/comments/types';

@Injectable()
export class PostsService {
  constructor(private postsRepository: PostsAdapter) {}

  async savePost(post: PostDomainModel) {
    return this.postsRepository.addPost(post);
  }

  async getExtendedPostsInfoByQuery(
    query: PaginationQuery,
    filter: any,
    userId?: string,
  ) {
    return this.postsRepository.getExtendedPostsInfoByQuery(
      query,
      filter,
      userId,
    );
  }

  async getExtendedPostInfo(
    id: string,
    userId?: string,
    filter?: Record<string, any>,
  ) {
    return this.postsRepository.getExtendedPostInfo(id, userId, filter);
  }

  async findPostCommentsByQuery(
    id: string,
    query: PaginationQuery,
    userId?: string,
  ) {
    return this.postsRepository.findPostCommentsByQuery(id, query, userId);
  }

  async findPostsByQuery(query: PaginationQuery, filter: any = {}) {
    return this.postsRepository.findPostsByQuery(query, filter);
  }

  async likePost(id: string, data: Partial<LikeDomainModel>) {
    return this.postsRepository.likePost(id, data);
  }

  async getAllPosts() {
    return this.postsRepository.getAllPosts();
  }

  async findPostById(id: string) {
    return this.postsRepository.findPostById(id);
  }

  async findPostByIdAndUpate(id: string, update: Partial<PostDomainModel>) {
    return this.postsRepository.findPostByIdAndUpdate(id, update);
  }

  async findPostByIdAndDelete(id: string) {
    return this.postsRepository.findPostByIdAndDelete(id);
  }

  async deleteAllPosts() {
    await this.postsRepository.deleteAllPosts();
  }

  async addComment(
    id: string,
    data: Pick<CommentDTO, 'content' | 'userId' | 'userLogin'>,
  ) {
    return await this.postsRepository.addComment(id, data);
  }
}
