import { ObjectId } from 'mongodb';

import { SortDirection } from '@/enums';

declare global {
  namespace Express {
    export interface Request {
      userId: string;
    }
  }
}

export interface FieldError {
  message: string | null;
  field: string | null;
}

export interface APIErrorResult {
  errorsMessages: FieldError[];
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
  searchNameTerm?: RegExp;
  searchLoginTerm?: RegExp;
  searchEmailTerm?: RegExp;
}

export interface User {
  _id: ObjectId;
  login: string;
  email: string;
  createdAt: Date;
}

export interface Comment {
  _id: ObjectId;
  content: string;
  userId: ObjectId;
  userLogin: string;
  createdAt: Date;
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

export declare namespace h05 {
  interface LoginInputModel {
    login: string;
    password: string;
  }

  interface UserInputModel {
    login: string;
    password: string;
    email: string;
  }

  interface UserViewModel {
    id: string;
    login: string;
    email: string;
    createdAt: string;
  }
}

export declare namespace h06 {
  interface CommentInputModel {
    content: string;
  }

  interface CommentViewModel {
    id: string;
    content: string;
    userId: string;
    userLogin: string;
    createdAt: string;
  }

  interface LoginSuccessViewModel {
    accessToken: string;
  }
}
