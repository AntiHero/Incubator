import { UserDTO, UserLeanModel } from '../types';

export const convertToUserDTO = <T extends UserLeanModel>(doc: T): UserDTO => ({
  id: String(doc._id),
  login: doc.login,
  email: doc.email,
  createdAt: doc.createdAt.toISOString(),
});
