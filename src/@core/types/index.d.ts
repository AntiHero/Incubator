import 'fastify';
import { HTTPMethods } from 'fastify';

import {
  BanStatus,
  LikeStatuses,
  SortDirectionKeys,
  SortDirections,
} from './enum';

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

export type PaginationQueryType = {
  pageNumber: number;
  pageSize: number;
  sortBy: string;
  sortDirection: SortDirectionKeys;
  banStatus?: BanStatus;
  searchNameTerm?: string;
  searchLoginTerm?: string;
  searchEmailTerm?: string;
};

export type PaginatorType<T> = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: T;
};

export type ReqCounterHistory = {
  [key: string]: { [key: string]: number };
};

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
    export interface User {
      userId: string;
    }

    export interface Request {
      login?: string;
      userId?: string;
      expDate?: number;
      deviceId?: string;
    }
  }
}

export type BanType = {
  isBanned: boolean;
  banDate: string;
};

export type PlayerData = {
  login: string;
  password: string;
  email: string;
};
