import { createEscapedString } from 'root/users/utils/createEscapedString';

export const updateCommentLikeQuery = (updates: any) => {
  const fields = createEscapedString(updates);

  return `
    UPDATE comment_likes SET ${fields} WHERE id=$1 RETURNING *
  `;
};
