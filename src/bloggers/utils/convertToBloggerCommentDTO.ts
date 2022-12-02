import { Types } from 'mongoose';

import { LikeDTO } from 'root/likes/types';
import { BloggerCommentDTO } from '../types';
import { CommentModel } from 'root/comments/schemas/comment.schema';
import { convertToLikeDTO } from 'root/likes/utils/convertToLikeDTO';

export const convertToBloggerCommentDTO = <
  T extends CommentModel & {
    _id: Types.ObjectId;
    blogId: Types.ObjectId;
    blogName: string;
    postId: Types.ObjectId;
    title: string;
  },
>(
  doc: T,
): BloggerCommentDTO => {
  let likes: LikeDTO[] = [];

  if (!doc.likes.some((like) => like instanceof Types.ObjectId)) {
    likes = doc.likes.map(convertToLikeDTO);
  }

  return {
    id: String(doc._id),
    content: doc.content,
    userLogin: doc.userLogin,
    userId: String(doc.userId),
    likes,
    isBanned: doc.isBanned,
    createdAt: doc.createdAt.toISOString(),
    postId: String(doc.postId),
    title: doc.title,
    blogId: String(doc.blogId),
    blogName: doc.blogName,
  };
};
