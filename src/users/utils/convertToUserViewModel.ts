import { UserDTO, UserViewModel } from '../types';

export const convertToUserViewModel = (user: UserDTO): UserViewModel => {
  const view = { ...user };

  return view;
};
