import { HydratedDocument } from 'mongoose';

import { UserCommentLike } from '@/@types';
import { UserCommentLikeDB } from '@/adapters/mongoose/types';

export const convertToUserCommentLike = <
  T extends HydratedDocument<UserCommentLikeDB>
>(
  doc: T
): UserCommentLike => ({
  id: String(doc._id),
  userId: String(doc.userId),
  commentId: String(doc.commentId),
  likeStatus: doc.likeStatus,
});
