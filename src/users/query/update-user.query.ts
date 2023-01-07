import { createEscapedString } from '../utils/createEscapedString';

export const updateUserQuery = (updates: any) => {
  const fields = createEscapedString(updates);

  return `
    UPDATE users SET ${fields} WHERE id=$1 RETURNING id
  `;
};
