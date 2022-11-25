import { Injectable } from '@nestjs/common';

import { LikeDTO } from './types';
import { LikesAdapter } from './adapter/mongoose';

@Injectable()
export class LikesService {
  constructor(private readonly likeRepository: LikesAdapter) {}

  async updateUserLikes(id: string, update: Partial<LikeDTO>) {
    return this.likeRepository.updateLikes(id, update);
  }
}
