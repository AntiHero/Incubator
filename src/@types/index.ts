import { ObjectId } from 'mongodb';
import { SortDirection } from '@/enums';

export interface FieldError {
  message: string | null;
  field: string | null;
}

export interface APIErrorResult {
  errorsMessages: FieldError[];
}

export declare namespace h04 {
  interface BlogInputModel {
    name: string;
    youtubeUrl: string;
  }

  interface BlogViewModel {
    id: string;
    name: string;
    youtubeUrl: string;
    createdAt: string;
  }

  interface PostInputModel {
    title: string;
    content: string;
    shortDescription: string;
    blogId: string;
  }

  interface PostViewModel {
    id: string;
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
    blogName: string;
    createdAt: string;
  }
}

export interface Blog {
  _id: ObjectId;
  name: string;
  youtubeUrl: string;
  createdAt: Date;
}

export interface Post {
  _id: ObjectId;
  title: string;
  shortDescription: string;
  content: string;
  blogId: ObjectId;
  blogName: string;
  createdAt: Date;
}

export interface Paginator<T> {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: T;
}

export interface PaginationQuery {
  pageNumber: number;
  pageSize: number;
  sortBy: string;
  sortDirection: SortDirection;
}
