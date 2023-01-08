import { createEscapedString } from '../utils/createEscapedString';

export const updateUserBanInfoQuery = (updates: any) => {
  const fields = createEscapedString(updates);

  return `
    UPDATE users_ban_info SET ${fields} WHERE id=$1 RETURNING id
  `;
};
