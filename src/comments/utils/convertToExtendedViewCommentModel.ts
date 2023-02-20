import { LikeStatuses } from 'root/@core/types/enum';
import { CommentDTO, CommentViewModel } from '../types';

export const convertToExtendedViewCommentModel = (
  comment: CommentDTO,
): CommentViewModel => {
  const likesCount = comment.likes.filter(
    (like) => like.likeStatus === LikeStatuses.Like,
  ).length;
  const dislikesCount = comment.likes.filter(
    (like) => like.likeStatus === LikeStatuses.Dislike,
  ).length;
  const myStatus =
    comment.likes.find((like) => like.userId === comment.userId)?.likeStatus ??
    LikeStatuses.None;

  return {
    id: comment.id,
    content: comment.content,
    userId: comment.userId,
    userLogin: comment.userLogin,
    createdAt: comment.createdAt,
    likesInfo: {
      likesCount,
      dislikesCount,
      myStatus,
    },
  };
};
