import { Injectable } from '@nestjs/common';

import { LikeDTO } from './types';
import { LikesRepository } from './adapter/likes.repository';

@Injectable()
export class LikesService {
  constructor(private readonly likesRepository: LikesRepository) {}

  async updateUserLikes(id: string, update: Partial<LikeDTO>) {
    return this.likesRepository.updateLikes(id, update);
  }
}
