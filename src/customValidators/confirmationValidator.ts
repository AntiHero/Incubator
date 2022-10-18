import { checkUsersConfirmation } from '@/domain/users.service';

export const validateConfirmation = async (value: string) => {
  const confirmation = await checkUsersConfirmation(value);

  if (!confirmation) throw new Error('Invalid confirmation code');

  return true;
};
