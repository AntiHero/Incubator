import { createEscapedString } from 'root/users/utils/createEscapedString';

export const updatePostLikeQuery = (updates: any) => {
  const fields = createEscapedString(updates);

  return `
    UPDATE post_likes SET ${fields} WHERE id=$1 RETURNING *
  `;
};
