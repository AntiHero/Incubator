import { LeanDocument, Types } from 'mongoose';

import { LikeDTO } from '../types';
import { LikeModel } from '../schemas/likes.schema';

export const convertToLikeDTO = <
  T extends LeanDocument<LikeModel & { _id: Types.ObjectId }>,
>(
  doc: T,
): LikeDTO => ({
  id: String(doc._id),
  userId: String(doc.userId),
  entityId: String(doc.entityId),
  likeStatus: doc.likeStatus,
  login: doc.login,
  isBanned: doc.isBanned,
  addedAt: doc.createdAt.toISOString(),
});
