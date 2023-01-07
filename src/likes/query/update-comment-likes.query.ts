import { createEscapedString } from 'root/users/utils/createEscapedString';

export const updateCommentLikesQuery = (updates: any) => {
  const fields = createEscapedString(updates);

  return `
    UPDATE comment_likes SET ${fields} WHERE "userId"=$1 RETURNING *
  `;
};
