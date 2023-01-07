import { CommentExtendedLikesDTO, CommentViewModel } from '../types';

export const convertToCommentViewModel = (
  comment: CommentExtendedLikesDTO,
): CommentViewModel => {
  return {
    id: comment.id,
    content: comment.content,
    userId: comment.userId,
    userLogin: comment.userLogin,
    createdAt: comment.createdAt,
    likesInfo: {
      likesCount: comment.likesCount,
      dislikesCount: comment.dislikesCount,
      myStatus: comment.userStatus,
    },
  };
};
