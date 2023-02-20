import { Comment } from '../entity/comment.entity';
import { LikesInfoViewModel } from 'root/@core/types';
import { CommentDTO, CommentViewModel } from '../types';

export class ConvertCommentData {
  static toDTO(comment: Comment): CommentDTO {
    return {
      id: String(comment.id),
      content: comment.content,
      isBanned: comment.isBanned,
      userId: String(comment.userId),
      entityId: String(comment.entityId),
      createdAt: comment.createdAt.toISOString(),
    };
  }
  static toViewModel(comment: CommentDTO): CommentViewModel {
    return {
      id: comment.id,
      content: comment.content,
      userId: comment.userId,
      createdAt: comment.createdAt,
    };
  }
  static toExtendedViewModel(
    comment: CommentDTO & { likesInfo: LikesInfoViewModel },
  ): CommentViewModel {
    return {
      id: comment.id,
      content: comment.content,
      userId: comment.userId,
      userLogin: comment.userLogin,
      createdAt: comment.createdAt,
      likesInfo: {
        likesCount: comment?.likesInfo.likesCount,
        dislikesCount: comment?.likesInfo.dislikesCount,
        myStatus: comment?.likesInfo.myStatus,
      },
    };
  }
}
