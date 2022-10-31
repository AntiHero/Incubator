import { h05, UserDBType } from '@/@types';

export const convertToUser = <T extends UserDBType>(
  doc: T
): h05.UserViewModel => ({
  id: String(doc._id),
  login: doc.login,
  email: doc.email,
  createdAt: doc.createdAt.toISOString(),
});
