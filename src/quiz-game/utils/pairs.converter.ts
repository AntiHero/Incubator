import { GamePairDTO, GamePairViewModel } from '../types';

export class GamePairConverter {
  static toView(game: GamePairDTO): GamePairViewModel {
    const firstPlayerAnswers = game.answers
      .filter((answer) => answer.playerId === game.firstPlayer.id)
      .map((answer) => ({
        questionId: answer.questionId,
        answerStatus: answer.answerStatus,
        addedAt: answer.addedAt,
      }));

    const firstPlayerInfo = {
      id: game.firstPlayer.id,
      login: game.firstPlayer.login,
    };

    const secondPlayerAnswers = game.answers
      .filter((answer) => answer.playerId === game.secondPlayer.id)
      .map((answer) => ({
        questionId: answer.questionId,
        answerStatus: answer.answerStatus,
        addedAt: answer.addedAt,
      }));

    const secondPlayerInfo = {
      id: game.secondPlayer.id,
      login: game.secondPlayer.login,
    };

    const questions = game.questions.map((question) => {
      return {
        id: question.id,
        body: question.body,
      };
    });

    return {
      id: game.id,
      firstPlayerProgress: {
        answers: firstPlayerAnswers,
        player: firstPlayerInfo,
        score: game.firstPlayerScore,
      },
      secondPlayerProgress: {
        answers: secondPlayerAnswers,
        player: secondPlayerInfo,
        score: game.secondPlayerScore,
      },
      questions,
      status: game.status,
      startGameDate: game.startGameDate,
      finishGameDate: game.finishGameDate,
      pairCreatedDate: game.pairCreatedDate,
    };
  }

  static toOnePlayerView(game: GamePairDTO): Partial<GamePairViewModel> {
    const firstPlayerAnswers = game.answers
      .filter((answer) => answer.playerId === game.firstPlayer.id)
      .map((answer) => ({
        questionId: answer.questionId,
        answerStatus: answer.answerStatus,
        addedAt: answer.addedAt,
      }));

    const firstPlayerInfo = {
      id: game.firstPlayer.id,
      login: game.firstPlayer.login,
    };

    return {
      id: game.id,
      firstPlayerProgress: {
        answers: firstPlayerAnswers,
        player: firstPlayerInfo,
        score: game.firstPlayerScore,
      },
      questions: null,
      status: game.status,
      secondPlayerProgress: null,
      startGameDate: game.startGameDate,
      finishGameDate: game.finishGameDate,
      pairCreatedDate: game.pairCreatedDate,
    };
  }
}
