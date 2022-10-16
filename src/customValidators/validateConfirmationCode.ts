import { checkUsersConfirmationCode } from '@/domain/users.service';

export const validateConfirmationCode = async (value: string) => {
  const confirmation = await checkUsersConfirmationCode(value);

  if (!confirmation) throw new Error('Invalid confirmation code');

  return true;
};
