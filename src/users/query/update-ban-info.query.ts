import { createEscapedString } from '../utils/createEscapedString';

export const updateUserBanInfoQuery = (updates: any) => {
  // const fields = Object.entries(updates)
  //   .map((entry) => {
  //     return (
  //       '"' +
  //       entry[0] +
  //       '"' +
  //       '=' +
  //       (typeof entry[1] === 'string' ? "'" + entry[1] + "'" : entry[1])
  //     );
  //   })
  //   .toString();

  const fields = createEscapedString(updates);

  return `
    UPDATE user_ban_info SET ${fields} WHERE id=$1 RETURNING id
  `;
};
