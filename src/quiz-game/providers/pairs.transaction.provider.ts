import { DataSource } from 'typeorm';
import { EntityManager } from 'typeorm';
import { Injectable } from '@nestjs/common';

import { Answer } from '../entity/answer.entity';
import { AnswerDTO, GameUpdates } from '../types';
import { PairGame } from '../entity/pairs.entity';
import { Question } from '../entity/question.entity';
import { User } from 'root/users/entity/user.entity';
import { AnswerStatuses, GameStatuses } from '../types/enum';
import { AnswersConverter } from '../utils/answers.converter';
import { PairsRepository } from '../infrastructure/repositories/pairs.repository';
import { BaseTransactionProvider } from 'root/@common/providers/transaction.provider';
import { FinishTheGameAfterDelayUseCase } from '../application/use-case/finish-the-game-after-delay.use-case-';

type PlayerAnswer = {
  playerId: string;
  answer: string;
  // answerOrder: number;
  // answersOrderObj: {
  //   [key: string]: number;
  // };
};

@Injectable()
export class PlayerAnswerTransaction extends BaseTransactionProvider<
  PlayerAnswer,
  AnswerDTO
> {
  public constructor(
    dataSource: DataSource,
    private readonly pairsRepository: PairsRepository,
    private readonly finishGame: FinishTheGameAfterDelayUseCase,
  ) {
    super(dataSource);
  }

  protected async execute(
    // { playerId, answer, answerOrder, answersOrderObj }: PlayerAnswer,
    { playerId, answer }: PlayerAnswer,
    manager: EntityManager,
  ) {
    const game = await manager
      .createQueryBuilder(PairGame, 'pairs')
      .useTransaction(true)
      .setLock('pessimistic_write', undefined, ['pairs'])
      .where([
        { firstPlayer: { id: Number(playerId) }, status: GameStatuses.Active },
        { secondPlayer: { id: Number(playerId) }, status: GameStatuses.Active },
      ])
      .setFindOptions({
        relations: {
          firstPlayer: true,
          secondPlayer: true,
        },
      })
      .getOne();

    if (!game || !game.questionsLength) return null;

    const {
      questions,
      id: gameId,
      firstPlayer,
      secondPlayer,
      firstPlayerScore,
      secondPlayerScore,
      firstPlayerAnswers,
      secondPlayerAnswers,
    } = game;

    const isCurrentPlayerFirst = game.isPlayerFirst(Number(playerId));

    const questionsCount = game.questionsLength;

    // if (answerOrder === questionsCount) return null;
    // if (answersOrder[playerId] === questionsCount) return null;
    if (isCurrentPlayerFirst) {
      if (firstPlayerAnswers.length === questionsCount) return null;
    } else {
      if (secondPlayerAnswers.length === questionsCount) return null;
    }

    let currentPlayerScore = 0;
    let anotherPlayerScore = 0;

    let currentPlayerAnswers: AnswerDTO[] = [];
    let anotherPlayerAnswers: AnswerDTO[] = [];

    if (isCurrentPlayerFirst) {
      currentPlayerScore = firstPlayerScore;
      currentPlayerAnswers = firstPlayerAnswers;

      anotherPlayerScore = secondPlayerScore;
      anotherPlayerAnswers = secondPlayerAnswers;
    } else {
      currentPlayerScore = secondPlayerScore;
      currentPlayerAnswers = secondPlayerAnswers;

      anotherPlayerScore = firstPlayerScore;
      anotherPlayerAnswers = firstPlayerAnswers;
    }

    const gameUpdates: GameUpdates = { id: gameId };

    const currentQuestion = game.getCurrentQuestion(Number(playerId));
    // const currentQuestion = questions[answerOrder];

    const isCorrect = game.isAnswerCorrect(answer, currentQuestion);

    if (isCorrect) {
      if (isCurrentPlayerFirst) {
        gameUpdates.firstPlayerScore = ++currentPlayerScore;
      } else {
        gameUpdates.secondPlayerScore = ++currentPlayerScore;
      }
    }

    const isAnswerLast = game.isAnswerLast;

    if (isAnswerLast) {
      this.finishGame.abort(Number(playerId));

      gameUpdates.status = GameStatuses.Finished;
      gameUpdates.finishGameDate = new Date();
    }

    const hasBonusPoint = anotherPlayerAnswers.some(
      (answer) => answer.answerStatus === AnswerStatuses.correct,
    );

    if (hasBonusPoint && isAnswerLast) {
      if (isCurrentPlayerFirst) {
        gameUpdates.secondPlayerScore = ++anotherPlayerScore;
      } else {
        gameUpdates.firstPlayerScore = ++currentPlayerScore;
      }
    }

    const { id: questionId } = currentQuestion;

    const answerStatus = isCorrect
      ? AnswerStatuses.correct
      : AnswerStatuses.incorrect;

    const newAnswer = Answer.create({
      question: <Question>{ id: Number(questionId) },
      player: <User>{ id: Number(playerId) },
      pairGame: <PairGame>{ id: gameId },
      answerStatus: answerStatus,
      addedAt: new Date(),
    });

    currentPlayerAnswers.push(newAnswer.toDTO());

    if (isCurrentPlayerFirst) {
      gameUpdates.firstPlayerAnswers = currentPlayerAnswers;
    } else {
      gameUpdates.secondPlayerAnswers = currentPlayerAnswers;
    }

    // const isMyAnswerLast = questionsCount - 1 === answerOrder;
    const isMyAnswerLast = questionsCount - 1 === currentPlayerAnswers.length;

    if (isMyAnswerLast && !isAnswerLast) {
      if (isCurrentPlayerFirst) {
        this.finishGame.execute(gameId, secondPlayer.id);
      } else {
        this.finishGame.execute(gameId, firstPlayer.id);
      }
    }

    await this.pairsRepository.updateGame(gameUpdates, manager);

    // if (gameUpdates.status) {
    //   delete answersOrderObj[playerId];

    //   if (isCurrentPlayerFirst) {
    //     delete answersOrderObj[secondPlayer.id];
    //   } else {
    //     delete answersOrderObj[firstPlayer.id];
    //   }
    // }

    return AnswersConverter.toDTO(newAnswer);
  }
}
