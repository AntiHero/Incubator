export enum PublishedStatus {
  all = 'all',
  published = 'published',
  notPublished = 'notPublished',
}

export enum AnswerStatuses {
  correct = 'Correct',
  incorrect = 'Incorrect',
}

export enum GameStatuses {
  Pending = 'PendingSecondPlayer',
  Active = 'Active',
  Finished = 'Finished',
}

export enum GamePairErrors {
  ALREADY_HAS_A_GAME = 'You have a pending or active game',
}

export enum Statistics {
  all = 'all',
  sumScore = 'sumScore',
  avgScore = 'avgScores',
  winsCount = 'winsCount',
  gamesCount = 'gamesCount',
  drawsCount = 'drawsCount',
  lossesCount = 'lossesCount',
}
