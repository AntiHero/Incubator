import { Meta } from 'express-validator';

import { checkRecoveryCode } from '@/app/users.service';

export const validateRecoveryCode = async (value: string, { req }: Meta) => {
  const userId = await checkRecoveryCode(value);

  if (!userId) throw new Error('Invalid recovery code');
  
  req.userId = userId;

  return true;
};
