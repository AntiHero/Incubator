import * as usersService from '@/app/users.service';
// import * as UsersRepository from '@/repository/users.repository';

export const validateConfirmationStatus = async (value: string) => {
  // const user = await UsersRepository.findUserByLoginOrEmail(value);
  const user = await usersService.findUserByLoginOrEmail(value);

  if (!user) throw new Error("User doesn't exist");

  if (user.confirmationInfo.isConfirmed) throw new Error('User is confirmed');

  return true;
};
