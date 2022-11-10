import { Injectable } from '@nestjs/common';
import { CommentsAdapter } from './adapter/mongoose';

@Injectable()
export class CommentsService {
  constructor(private commentsRepository: CommentsAdapter) {}

  async getExtendedCommentInfo(id: string, userId = '') {
    return this.commentsRepository.getExtendedCommentInfo(id, userId);
  }
}
