import { Injectable } from '@nestjs/common';

import { CommentDTO } from './types';
import { LikeDTO } from 'root/likes/types';
import { CommentsAdapter } from './adapter/mongoose';

@Injectable()
export class CommentsService {
  constructor(private commentsRepository: CommentsAdapter) {}

  async findCommentById(id: string) {
    return this.commentsRepository.findCommentById(id);
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
    return this.commentsRepository.getExtendedCommentInfo(id, userId);
  }
}
