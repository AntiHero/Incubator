import * as usersService from '@/app/users.service';

export const validateConfirmationStatus = async (value: string) => {
  const user = await usersService.findUserByLoginOrEmail(value);

  if (!user) throw new Error("User doesn't exist");

  if (user.confirmationInfo.isConfirmed) throw new Error('User is confirmed');

  return true;
};
