import { createEscapedString } from 'root/users/utils/createEscapedString';

export const updateBlogQuery = (updates: any) => {
  const fields = createEscapedString(updates);

  return `
    UPDATE blogs SET ${fields} WHERE id=$1 RETURNING *
  `;
};
