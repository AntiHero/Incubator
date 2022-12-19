import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { LikeDomainModel } from '../types';
import { ConvertLikeData } from '../utils/convertLike';
import { CommentLike, PostLike } from '../entity/like.entity';
import { updatePostLikesQuery } from '../query/update-post-likes.query';
import { updateCommentLikesQuery } from '../query/update-comment-likes.query';

@Injectable()
export class CommentsQueryRepository {
  constructor(
    @InjectRepository(PostLike)
    private readonly postsLikesRepository: Repository<PostLike>,
    @InjectRepository(CommentLike)
    private readonly commentLikesRepository: Repository<CommentLike>,
  ) {}

  async addLike(likeData: Partial<LikeDomainModel>) {
    try {
      const { entityId, userId, likeStatus } = likeData;

      const postLike = (
        await this.postsLikesRepository.query(
          `
            INSERT INTO post_likes ("entityId", "userId", "likeStatus", "isBanned")
              VALUES ($1, $2, $3, DEFAULT) RETURNING *
          `,
          [entityId, userId, likeStatus],
        )
      )[0];

      return ConvertLikeData.toDTO(postLike);
    } catch (error) {
      console.error(error);

      return null;
    }
  }

  async updateLikes(userId: string, updates: Partial<LikeDomainModel>) {
    await this.commentLikesRepository.query(updateCommentLikesQuery(updates), [
      userId,
    ]);
    await this.postsLikesRepository.query(updatePostLikesQuery(updates), [
      userId,
    ]);
  }

  async deleteAll() {
    await this.commentLikesRepository.query(`DELETE FROM comment_likes`);
    await this.postsLikesRepository.query(`DELETE FROM post_likes`);
  }
}
