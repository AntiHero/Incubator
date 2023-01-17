import { PublishedStatus } from './enum';

type QuestionViewModel = {
  id: string | null;
  body: string | null;
  correctAnswers: any[];
  published: boolean;
  createdAt: string;
  updatedAt: string | null;
};

type QuestionDTOModel = QuestionViewModel;

type QuestionInputModel = {
  body: string;
  correctAnswers: any[];
};

export type QuestionPaginationQuery = {
  pageNumber: number;
  pageSize: number;
  sortBy: string;
  sortDirection: SortDirectionKeys;
  publishedStatus: PublishedStatus;
  searchBodyTerm: string;
};
