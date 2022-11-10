import { LikeDTO, LikeLeanModel } from '../types';

export const convertToLikeDTO = <T extends LikeLeanModel>(doc: T): LikeDTO => ({
  id: String(doc._id),
  userId: String(doc.userId),
  entityId: String(doc.entityId),
  likeStatus: doc.likeStatus,
  login: doc.login,
  addedAt: doc.addedAt.toISOString(),
});
