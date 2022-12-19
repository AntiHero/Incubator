import { createEscapedString } from 'root/users/utils/createEscapedString';

export const updatePostLikesQuery = (updates: any) => {
  const fields = createEscapedString(updates);

  return `
    UPDATE post_likes SET ${fields} WHERE "userId"=$1 RETURNING *
  `;
};
