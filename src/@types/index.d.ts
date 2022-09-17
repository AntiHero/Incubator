export declare namespace h01 {
  enum Resolutions {
    P144 = 'P144',
    P240 = 'P240',
    P360 = 'P360',
    P480 = 'P480',
    P720 = 'P720',
    P1080 = 'P1080',
    P1440 = 'P1440',
    P2160 = 'P2160',
  }

  interface CreateVideoInputModel {
    title: string;
    author: string;
    availableResolutions: Resolutions[];
  }

  interface UpdateVideoInputModel extends CreateVideoInputModel {
    canBeDownloaded: boolean;
    minAgeRestriction: number;
    publicationDate: string;
  }

  interface Video {
    id: number;
    title: string | null;
    author: string | null;
    canBeDownloaded: boolean;
    minAgeRestriction: number | null;
    createdAt: string;
    publicationDate: string;
    availableResolutions: Resolutions[];
  }
}

export interface FieldError {
  message: string;
  field: string;
}

export interface MetadataObj {
  name: string | symbol;
  parameterIndex: number;
  isValid(arg: any): true | string;
}

export interface APIErrorResult {
  errorsMessages: FieldError[];
}
