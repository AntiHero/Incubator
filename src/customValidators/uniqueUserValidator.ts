import { body } from 'express-validator';

import { UserFields } from '@/enums';
import { findUserByLoginOrEmail } from '@/repository/users.repository';

export const validateUserUnicity = body([
  UserFields.login,
  UserFields.email,
]).custom(async (value) => {
  const user = await findUserByLoginOrEmail(value);

  if (!user) throw new Error('User already exists');

  return true;
});
