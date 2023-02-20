import { GamePairDTO, GamePairViewModel } from '../types';
import { AnswersConverter } from './answers.converter';

export class GamePairConverter {
  static toView(game: GamePairDTO): GamePairViewModel {
    const firstPlayerInfo = {
      id: game.firstPlayer.id,
      login: game.firstPlayer.login,
    };

    const firstPlayerAnswers = game.firstPlayerAnswers.map(
      AnswersConverter.toView,
    );

    const secondPlayerAnswers = game.secondPlayerAnswers.map(
      AnswersConverter.toView,
    );

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
    const firstPlayerAnswers = game.firstPlayerAnswers.map(
      AnswersConverter.toView,
    );

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
