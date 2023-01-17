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
  pending = 'PendingSecondPlayer',
  active = 'Active',
  finished = 'Finished',
}

export enum GamePairErrors {
  ALREADY_HAS_A_GAME = 'You have a pending or active game',
}
