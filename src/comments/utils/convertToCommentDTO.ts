import { convertToLikeDTO } from 'root/likes/utils/convertToLikeDTO';
import { CommentDTO, CommentLeanModel } from '../types';

export const convertToCommentDTO = <T extends CommentLeanModel>(
  doc: T,
  populate = false,
): CommentDTO => ({
  id: String(doc._id),
  content: doc.content,
  userLogin: doc.userLogin,
  userId: String(doc.userId),
  likes: populate ? doc.likes.map(convertToLikeDTO) : [],
  entityId: String(doc.entityId),
  createdAt: doc.createdAt.toISOString(),
});
