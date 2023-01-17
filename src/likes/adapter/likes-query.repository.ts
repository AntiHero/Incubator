import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CommentLike, PostLike } from '../entity/like.entity';

@Injectable()
export class LikeQueryRepository {
  constructor(
    @InjectRepository(PostLike)
    private readonly postsLikesRepository: Repository<PostLike>,
    @InjectRepository(CommentLike)
    private readonly commentLikesRepository: Repository<CommentLike>,
  ) {}
}
