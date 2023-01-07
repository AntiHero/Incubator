import { createEscapedString } from 'root/users/utils/createEscapedString';

export const updateCommentQuery = (updates: any) => {
  const fields = createEscapedString(updates);

  return `
    UPDATE comments SET ${fields} WHERE id=$1 RETURNING *
  `;
};
