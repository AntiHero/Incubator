import { ObjectId } from 'mongodb';

export interface FieldError {
  message: string | null;
  field: string | null;
}

export interface APIErrorResult {
  errorsMessages: FieldError[];
}

export declare namespace h02 {
  namespace db {
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
}

export enum BlogFields {
  name = 'name',
  youtubeUrl = 'youtubeUrl',
}

export enum PostFields {
  title = 'title',
  content = 'content',
  blogId = 'blogId',
  blogName = 'blogName',
  shortDescription = 'shortDescription',
}

export enum Headers {
  'Authorization' = 'authorization',
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
