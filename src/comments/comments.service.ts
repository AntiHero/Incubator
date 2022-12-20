import { Injectable } from '@nestjs/common';

import { CommentDTO } from './types';
import { LikeDTO } from 'root/likes/types';
import { CommentsAdapter } from './adapter/mongoose';
import { CommentsRepository } from './adapter/comment.repository';
import { CommentsQueryRepository } from './adapter/comment-query.repository';

@Injectable()
export class CommentsService {
  constructor(
    private readonly commentsRepository: CommentsRepository,
    private readonly commentsQueryRepository: CommentsQueryRepository,
  ) {}

  async findCommentById(id: string) {
    return this.commentsQueryRepository.findCommentById(id);
  }

  async updateUserComments(userId: string, update: Partial<CommentDTO>) {
    return this.commentsRepository.updateComments(userId, update);
  }

  async deleteComment(id: string) {
    return this.commentsRepository.findCommentByIdAndDelete(id);
  }

  async likeComment(id: string, data: Partial<LikeDTO>) {
    return this.commentsRepository.likeComment(id, data);
  }

  async findCommentByIdAndUpdate(id: string, data: Partial<CommentDTO>) {
    return this.commentsRepository.findCommentByIdAndUpdate(id, data);
  }

  async getExtendedCommentInfo(id: string, userId?: string) {
    return this.commentsQueryRepository.getExtendedCommentInfo(id, userId);
  }
}
