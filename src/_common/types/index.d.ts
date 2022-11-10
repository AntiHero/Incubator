import { LikeStatuses, SortDirections } from './enum';

export type LikesInfoViewModel = {
  likesCount: number;
  dislikesCount: number;
  myStatus: LikeStatuses;
};

export type PaginationQuery = {
  pageNumber: number;
  pageSize: number;
  sortBy: string;
  sortDirection: SortDirections;
  searchNameTerm?: RegExp;
  searchLoginTerm?: RegExp;
  searchEmailTerm?: RegExp;
};

export type PaginatorType<T> = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: T;
};
