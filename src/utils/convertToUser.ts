import { h05, User } from '@/@types';

export const convertToUser = <T extends User>(doc: T): h05.UserViewModel => ({
  id: String(doc._id),
  login: doc.login,
  email: doc.email,
  createdAt: doc.createdAt.toISOString(),
});
