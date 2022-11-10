import { PaginationQuery } from './types';
import { SortDirections } from './types/enum';

export const defaultPaginationQuery: PaginationQuery = {
  pageNumber: 1,
  pageSize: 10,
  sortBy: 'createdAt',
  sortDirection: SortDirections.desc,
};
