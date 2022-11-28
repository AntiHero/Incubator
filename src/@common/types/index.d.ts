import 'fastify';
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

export type IpsType = { [key: string]: { [key: string]: RateLimiter } };

interface RateLimiter {
  count: number;
}

declare module 'fastify' {
  export interface FastifyRequest {
    login: string;
    userId: string;
    expDate: number;
    deviceId: string;
  }
}

export interface FieldError {
  message: string | null;
  field: string | null;
}

export interface APIErrorResult {
  errorsMessages: FieldError[];
}

declare global {
  namespace Express {
    export interface Request {
      login: string;
      userId: string;
      expDate: number;
      deviceId: string;
    }
  }
}

export type BanType = {
  isBanned: boolean;
  banDate: string;
};
