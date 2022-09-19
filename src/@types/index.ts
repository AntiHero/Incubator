interface FieldError {
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
    }

    interface PostInputModel {
      title: string;
      content: string;
      blogId: string;
    }
   
    interface PostViewModel {
      id: string | null;
      title: string | null;
      shortDescription: string | null;
      content: string | null;
      blogId: string | null;
      blogName: string | null;
    }
  }
}
