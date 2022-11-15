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
  createdAt: doc.createdAt?.toISOString(),
});
