import { createEscapedString } from 'root/users/utils/createEscapedString';

export const updatePostQuery = (updates: any) => {
  const fields = createEscapedString(updates);

  return `
    UPDATE posts SET ${fields} WHERE id=$1 RETURNING *
  `;
};
