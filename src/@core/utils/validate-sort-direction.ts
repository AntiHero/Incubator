import { SortDirection } from '../types/enum';

export function validateSortDirection(sortDirection: string) {
  sortDirection = sortDirection?.toUpperCase();

  return (
    Object.values(SortDirection).find((sD) => sD === sortDirection) ??
    SortDirection.DESC
  );
}
