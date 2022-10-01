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
      id: string | null;
      name: string | null;
      youtubeUrl: string | null;
      createdAt?: string;
    }

    interface PostInputModel {
      title: string;
      content: string;
      shortDescription: string;
      blogId: string;
    }

    interface PostViewModel {
      id: string | null;
      title: string | null;
      shortDescription: string | null;
      content: string | null;
      blogId: string | null;
      blogName: string | null;
      createdAt?: string;
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
