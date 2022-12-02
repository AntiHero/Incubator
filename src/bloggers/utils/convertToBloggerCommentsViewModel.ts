import { Types } from 'mongoose';
import { LikeStatuses } from 'root/@common/types/enum';
import { BloggerCommentDTO, BloggerCommentsViewModel } from '../types';

export const convertToBloggerCommentViewModel = (
  doc: BloggerCommentDTO,
  userId: string,
): BloggerCommentsViewModel => {
  let likesCount = 0;
  let dislikesCount = 0;

  doc.likes.forEach((like) => {
    if (like instanceof Types.ObjectId) return;

    if (like.likeStatus === LikeStatuses.Like) {
      likesCount++;
    }

    if (like.likeStatus === LikeStatuses.Dislike) {
      dislikesCount++;
    }
  });

  const myStatus =
    doc.likes.find((like) => {
      if (like instanceof Types.ObjectId) return;

      return like.userId === userId;
    })?.likeStatus ?? LikeStatuses.None;

  return {
    id: doc.id,
    content: doc.content,
    createdAt: doc.createdAt,
    commentatorInfo: {
      userId: doc.userId,
      userLogin: doc.userLogin,
    },
    likesInfo: {
      likesCount,
      dislikesCount,
      myStatus,
    },
    postInfo: {
      id: doc.postId,
      title: doc.title,
      blogId: doc.blogId,
      blogName: doc.blogName,
    },
  };
};
