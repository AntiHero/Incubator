import { Types } from 'mongoose';

import { BannedUserForEntityDTO } from '../types';
import { BannedUserForEntityModel } from '../schemas/banned-user-for-entity.schema';

export const convertToBannedUserDTO = <
  T extends BannedUserForEntityModel & { _id: Types.ObjectId; login: string },
>(
  doc: T,
): BannedUserForEntityDTO => {
  return {
    id: String(doc._id),
    entityId: String(doc.entityId),
    userId: String(doc._id),
    login: doc.login,
    banDate: doc.banDate?.toISOString(),
    banReason: doc.banReason,
    isBanned: doc.isBanned,
  };
};
