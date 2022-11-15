import { LeanDocument, Types } from 'mongoose';

import { CommentDTO } from '../types';
import { CommentModel } from '../schemas/comment.schema';
import { convertToLikeDTO } from 'root/likes/utils/convertToLikeDTO';
import { LikeDTO } from 'root/likes/types';

export const convertToCommentDTO = <
  T extends LeanDocument<CommentModel & { _id: Types.ObjectId }>,
>(
  doc: T,
): CommentDTO => {
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
    entityId: String(doc.entityId),
    createdAt: doc.createdAt.toISOString(),
  };
};
