import { UserConfirmationInfo } from '../entity/user-confirmation-info.entity';
import { createEscapedString } from '../utils/createEscapedString';

export const updateUserConfirmationInfo = (
  updates: Partial<UserConfirmationInfo>,
) => {
  const fields = createEscapedString(updates);

  return `
    UPDATE user_confirmation_info SET ${fields}, code=gen_random_uuid () WHERE id=$1 RETURNING code 
  `;
};
