export const addOneDay = (date: string) => {
  return new Date(
    new Date(date).setDate(new Date(date).getDate() + 1)
  ).toISOString();
};
