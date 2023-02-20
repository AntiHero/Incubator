import { Types } from 'mongoose';
import { LikeStatuses } from 'root/@core/types/enum';
import { BloggerCommentDTO, BloggerCommentsViewModel } from '../types';

export const convertToBloggerCommentViewModel = (
  doc: BloggerCommentDTO,
): BloggerCommentsViewModel => {
  return {
    id: doc.id,
    content: doc.content,
    createdAt: doc.createdAt,
    commentatorInfo: {
      userId: doc.userId,
      userLogin: doc.userLogin,
    },
    likesInfo: {
      likesCount: doc.likesCount,
      dislikesCount: doc.dislikesCount,
      myStatus: doc.userStatus,
    },
    postInfo: {
      id: doc.postId,
      title: doc.title,
      blogId: doc.blogId,
      blogName: doc.blogName,
    },
  };
};
