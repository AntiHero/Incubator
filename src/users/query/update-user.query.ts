export const updateUserQuery = (updates: any) => {
  const fields = Object.entries(updates)
    .map((entry) => {
      return (
        '"' +
        entry[0] +
        '"' +
        '=' +
        (typeof entry[1] === 'string' ? "'" + entry[1] + "'" : entry[1])
      );
    })
    .toString();

  return `
    UPDATE users SET ${fields} WHERE id=$1 RETURNING *
  `;
};
