export declare namespace h01 {
  enum Resolutions {
    P144 = 'P144',
    P240 = 'P240',
    P360 = 'P360',
    P480 = 'P480',
    P720 = 'P720',
    P1080 = 'P1080',
    P1440 = 'P1440',
    P160 = 'P2160',
  }

  interface CreateVideoInputModel {
    title: string;
    author: string;
    availableResolutions?: Resolutions[];
  }

  interface UpdateVideoInputModel extends CreateVideoInputModel {
    canBeDownloaded?: boolean;
    minAgeRestriction?: number;
    publicationDate?: string;
  }

  interface Video {
    id: number;
    title: string;
    author: string;
    canBeDownloaded: boolean;
    minAgeRestriction: number;
    createdAt: string;
    publicationDate: string;
    availableResolutions: Resolutions[];
  }
}

export interface FieldError {
  message: string;
  field: string;
}

export interface APIErrorResult {
  errorsMessages: FieldError[];
}
