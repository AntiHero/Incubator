import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CommentDomainModel } from '../types';
import { Comment } from '../entity/comment.entity';
import { LikeDomainModel } from 'root/likes/types';
import { LikeStatuses } from 'root/@common/types/enum';
import { CommentLike } from 'root/likes/entity/like.entity';
import { ConvertCommentData } from '../utils/convertComment';
import { updateCommentQuery } from '../query/update-comment.query';
import { updateCommentsQuery } from '../query/update-comments.query';
import { updateCommentLikeQuery } from '../query/update-comment-like.query';

@Injectable()
export class CommentsRepository {
  constructor(
    @InjectRepository(Comment)
    private readonly commentsRepository: Repository<Comment>,
    @InjectRepository(CommentLike)
    private readonly commentLikesRepository: Repository<CommentLike>,
  ) {}

  async likeComment(id: string, likeData: Partial<LikeDomainModel>) {
    try {
      /* NEED DATA ID VERIFICATION*/

      const like = (
        await this.commentLikesRepository.query(
          `
          SELECT * FROM comment_likes WHERE "entityId"=$1 LIMIT 1
        `,
          [id],
        )
      )[0];

      if (!like) {
        const { likeStatus, userId } = likeData;

        if (likeStatus === LikeStatuses.None) return true;

        await this.commentLikesRepository.query(
          `
            INSERT INTO comment_likes ("entityId", "userId", "likeStatus", "isBanned")
            VALUES ($1, $2, $3, DEFAULT)
          `,
          [like.id, userId, likeStatus],
        );

        return true;
      } else {
        if (likeData.likeStatus === LikeStatuses.None) {
          await this.commentLikesRepository.query(
            `
              DELETE FROM comment_likes WHERE id=$1
            `,
            [like.id],
          );
        } else {
          await this.commentLikesRepository.query(
            updateCommentLikeQuery({ likeStatus: likeData.likeStatus }),
            [like.id],
          );
        }

        return true;
      }
    } catch (error) {
      console.error(error);

      return null;
    }
  }

  async addComment(entityId: string, commentData: Partial<CommentDomainModel>) {
    try {
      const { userId, content } = commentData;

      const createdComment = (
        await this.commentsRepository.query(
          `
          INSERT INTO comments ("entityId", "userId", "content", "isBanned")
          VALUES ($1, $2, $3, DEFAULT)
          RETURNING *
        `,
          [entityId, userId, content],
        )
      )[0];

      return ConvertCommentData.toDTO(createdComment);
    } catch (error) {
      console.error(error);

      return null;
    }
  }

  async findCommentByIdAndDelete(id: string) {
    await this.commentsRepository.query(
      `
        DELETE FROM comments WHERE id=$1 
      `,
      [id],
    );
  }

  async deleteAllComments() {
    await this.commentsRepository.query(
      `
        DELETE FROM comments
      `,
    );
  }

  async findCommentByIdAndUpdate(
    id: string,
    updates: Partial<CommentDomainModel>,
  ) {
    try {
      const updatedComment = (
        await this.commentsRepository.query(updateCommentQuery(updates), [id])
      )[0][0];

      if (updatedComment) return true;
    } catch (error) {
      console.error(error);

      return null;
    }
  }

  async updateComments(userId: string, updates: Partial<CommentDomainModel>) {
    try {
      const updatedComment = (
        await this.commentsRepository.query(updateCommentsQuery(updates), [
          userId,
        ])
      )[0][0];

      if (updatedComment) return true;
    } catch (error) {
      console.error(error);

      return null;
    }
  }
}
