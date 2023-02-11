import { SortDirection } from 'root/@common/types/enum';
import { PublishedStatus, Statistics } from './enum';
import { AnswerStatuses, GameStatuses } from './enum';

export type QuestionViewModel = {
  id: string | null;
  body: string | null;
  correctAnswers: any[];
  published: boolean;
  createdAt: string;
  updatedAt: string | null;
};

export type QuestionDTO = {
  id: string;
  body: string;
  correctAnswers: any[];
  published: boolean;
  createdAt: string;
  updatedAt: string;
};

export type QuestionInputModel = {
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

export type AnswerInputModel = {
  answer: string | null;
};

export type AnswerViewModel = {
  questionId: string;
  answerStatus: AnswerStatuses;
  addedAt: string;
};

export type AnswerDTO = AnswerViewModel & {
  playerId: string;
  gameId: string;
  questionId: string;
  answerStatus: AnswerStatuses;
};

export type AnswerData = {
  gameId: string;
  playerId: string;
  questionId?: string;
  answerStatus?: AnswerStatuses;
};

export type PlayerViewModel = {
  id: string | null;
  login: string | null;
};

export type AnswerUpdates = {
  id: number;
  questionId: string;
  answerStatus: AnswerStatuses;
};

export type PlayerDTO = PlayerViewModel;

export type GamePlayerProgressViewModel = {
  answers: AnswerViewModel[] | null;
  player: PlayerViewModel;
  score: number;
};

export type GamePairViewModel = {
  id: string | null;
  firstPlayerProgress: GamePlayerProgressViewModel;
  secondPlayerProgress: GamePlayerProgressViewModel;
  questions: { id: string; body: string }[] | null;
  status: GameStatuses;
  pairCreatedDate: string;
  startGameDate: string | null;
  finishGameDate: string | null;
};

export type GamePairDTO = {
  id: string;
  firstPlayer: PlayerDTO;
  secondPlayer: PlayerDTO;
  firstPlayerScore: number;
  secondPlayerScore: number;
  questions: QuestionDTO[];
  status: GameStatuses;
  pairCreatedDate: string;
  startGameDate: string;
  finishGameDate: string;
  firstPlayerAnswers: AnswerDTO[];
  secondPlayerAnswers: AnswerDTO[];
};

export type GamePayload = {
  firstPlayer: Partial<UserDTO>;
};

export type GameUpdates = {
  id: string;
  status?: GameStatuses;
  finishGameDate?: Date;
  firstPlayerScore?: number;
  secondPlayerScore?: number;
  firstPlayerAnswers?: AnswerDTO[];
  secondPlayerAnswers?: AnswerDTO[];
};

export type PairsQuery = {
  sortBy: string;
  pageSize: number;
  pageNumber: number;
  sortDirection: SortDirection;
};

export type TopUsersQuery = {
  pageSize: number;
  pageNumber: number;
  sort: string[] | string;
};

export type TopUsersSanitizedQuery = Omit<TopUsersQuery, 'sort'> & {
  sort: [string, string][];
};

export type TopUsersDBType = { [key in Statistics]: string } & {
  playerId: string;
  login: string;
};

export type TopGamePlayerViewModel = {
  sumScore: number;
  avgScores: number;
  gamesCount: number;
  winsCount: number;
  lossesCount: number;
  drawsCount: number;
  player: PlayerViewModel;
};
