export const createEscapedString = <T>(obj: T) =>
  Object.entries(obj)
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
