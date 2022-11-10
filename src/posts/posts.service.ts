import { Injectable } from '@nestjs/common';
import { PostsAdapter } from './adapter/mongooose';
import { PostDomainModel } from './types';

@Injectable()
export class PostsService {
  constructor(private postAdapter: PostsAdapter) {}
  async save(post: PostDomainModel) {
    return await this.postAdapter.createPost(post);
  }
}
