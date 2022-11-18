import { UserDTO, UserViewModel } from '../types';

export const convertToUserViewModel = (user: UserDTO): UserViewModel => {
  const { id, login, email, createdAt, banInfo } = user;
  const view = { id, login, email, createdAt, banInfo };

  return view;
};
