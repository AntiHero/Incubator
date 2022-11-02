import { CommentModelType, h11 } from '@/@types';

export const convertToCommentViewModel = <
  T extends CommentModelType & { id: string }
>(
  doc: T
): h11.CommentViewModel => ({
  id: doc.id,
  content: doc.content,
  userLogin: doc.userLogin,
  userId: String(doc.userId),
  createdAt: doc.createdAt as string,
  likesInfo: { ...doc.likesInfo },
});
