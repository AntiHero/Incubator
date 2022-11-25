import { Injectable } from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';

import { LikeDTO } from './types';
import { LikesAdapter } from './adapter/mongoose';

@Injectable()
export class LikesService {
  constructor(private readonly likeRepository: LikesAdapter) {}

  async updateUserLikes(id: string, updates: Partial<LikeDTO>) {
    return this.likeRepository.updateLikes(id, { isBanned: true });
  }
}
