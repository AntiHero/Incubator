export const countSkip = (pageSize: number, pageNumber: number) =>
  Math.ceil(pageSize * (pageNumber - 1));
