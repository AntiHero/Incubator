import { createEscapedString } from 'root/users/utils/createEscapedString';

export const updateCommentsQuery = (updates: any) => {
  const fields = createEscapedString(updates);

  return `
    UPDATE comments SET ${fields} WHERE "userId"=$1 RETURNIGN *
  `;
};
