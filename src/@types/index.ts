interface FieldError {
  message: string | null;
  field: string | null;
}

export interface APIErrorResult {
  errorsMessages: FieldError[];
}

export interface h02 {
  db: {
    BlogInputModel: {
      name: string;
      youtubeUrl: string;
    };
    BlogViewModel: {
      id: string | null;
      name: string | null;
      youtubeUrl: string | null;
    };
    PostInputModel: {
      title: string;
      content: string;
      blogId: string;
    };
    PostViewModel: {
      id: string | null;
      title: string | null;
      shortDescription: string | null;
      content: string | null;
      blogId: string | null;
      blogName: string | null;
    };
  };
}
