import { h06, Comment } from '@/@types';

export const convertToComment = <T extends Comment>(
  doc: T
): h06.CommentViewModel => ({
  id: String(doc._id),
  content: doc.content,
  userLogin: doc.userLogin,
  userId: String(doc.userId),
  createdAt: doc.createdAt.toISOString(),
});
