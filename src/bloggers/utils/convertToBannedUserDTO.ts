import { LeanDocument, Types } from 'mongoose';
import { BannedUserForEntityModel } from '../schemas/banned-user-for-entity.schema';
import { BannedUserForEntityDTO } from '../types';

export const convertToBannedUserDTO = <
  T extends LeanDocument<BannedUserForEntityModel & { _id: Types.ObjectId }>,
>(
  doc: T,
): BannedUserForEntityDTO => {
  return {
    id: String(doc._id),
    entityId: String(doc.entityId),
    userId: String(doc.user._id),
    login: doc.user instanceof Types.ObjectId ? '' : doc.user.login,
    banDate: doc.banDate.toISOString(),
    banReason: doc.banReason,
    isBanned: doc.isBanned,
  };
};
