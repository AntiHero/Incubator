import { HydratedDocument } from 'mongoose';

import { CommentDBType, CommentModelType } from '@/@types';

export const convertToComment = <T extends HydratedDocument<CommentDBType>>(
  doc: T
): CommentModelType & { id: string } => ({
  id: doc.id,
  content: doc.content,
  userLogin: doc.userLogin,
  userId: String(doc.userId),
  postId: String(doc.postId),
  createdAt: doc.createdAt.toISOString(),
  likesInfo: { ...doc.likesInfo },
});
