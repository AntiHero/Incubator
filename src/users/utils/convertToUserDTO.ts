import { LeanDocument, Types } from 'mongoose';
import { UserModel } from '../schema/users.schema';
import { UserDTO } from '../types';

export const convertToUserDTO = <
  T extends LeanDocument<
    UserModel &
      Required<{
        _id: Types.ObjectId;
      }>
  >,
>(
  doc: T,
): UserDTO => ({
  id: String(doc._id),
  login: doc.login,
  email: doc.email,
  banInfo: {
    banDate: doc.banInfo.banDate ? doc.banInfo.banDate.toISOString() : null,
    banReason: doc.banInfo.banReason,
    isBanned: doc.banInfo.isBanned,
  },
  password: doc.password,
  confirmationInfo: {
    isConfirmed: doc.confirmationInfo.isConfirmed,
    code: doc.confirmationInfo.code,
    expDate: doc.confirmationInfo.expDate,
  },
  passwordRecover: {
    code: doc.passwordRecover.code,
  },
  createdAt: doc.createdAt?.toISOString(),
});
