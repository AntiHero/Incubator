import { Injectable } from '@nestjs/common';

import { PostDomainModel } from './types';
import { Roles } from 'root/users/types/roles';
import { CommentDTO } from 'root/comments/types';
import { LikeDomainModel } from 'root/likes/types';
import { PaginationQueryType } from 'root/@common/types';
import { PostsRepository } from './adapter/posts.repostitory';
import { PostsQueryRepository } from './adapter/posts-query.repository';

@Injectable()
export class PostsService {
  constructor(
    // private postsRepository: PostsAdapter
    private readonly postsRepository: PostsRepository,
    private readonly postsQueryRepository: PostsQueryRepository,
  ) {}

  async savePost(post: PostDomainModel) {
    return this.postsRepository.addPost(post);
  }

  async getExtendedPostsInfoByQuery(
    query: PaginationQueryType,
    filter: any,
    userId?: string,
  ) {
    return this.postsQueryRepository.getExtendedPostsInfoByQuery(
      query,
      filter,
      userId,
    );
  }

  async getExtendedPostInfo(id: string, userId?: string, forRole?: Roles) {
    return this.postsQueryRepository.getExtendedPostInfo(id, userId, forRole);
  }

  async findPostCommentsByQuery(
    id: string,
    query: PaginationQueryType,
    userId?: string,
  ) {
    return this.postsQueryRepository.findPostCommentsByQuery(id, query, userId);
  }

  async findPostsByQuery(query: PaginationQueryType, filter: any = {}) {
    return this.postsQueryRepository.findPostsByQuery(query, filter);
  }

  async likePost(id: string, data: Partial<LikeDomainModel>, userId: string) {
    return this.postsRepository.likePost(id, data, userId);
  }

  async getAllPosts() {
    return this.postsQueryRepository.getAllPosts();
  }

  async findPostById(id: string) {
    return this.postsQueryRepository.findPostById(id);
  }

  async findPostByIdAndUpate(id: string, update: Partial<PostDomainModel>) {
    return this.postsRepository.findPostByIdAndUpdate(id, update);
  }

  async findPostByIdAndDelete(id: string) {
    return this.postsRepository.findPostByIdAndDelete(id);
  }

  async deleteAllPosts() {
    await this.postsQueryRepository.deleteAllPosts();
  }

  async addComment(
    id: string,
    data: Pick<CommentDTO, 'content' | 'userId' | 'userLogin'>,
  ) {
    return await this.postsRepository.addComment(id, data);
  }
}
