import { DataSource } from 'typeorm';
import { EntityManager } from 'typeorm';
import { Injectable } from '@nestjs/common';

import { Answer } from '../../infrastructure/database/entity/answer.entity';
import { AnswerDTO } from '../../@common/types';
import { PairGame } from '../../infrastructure/database/entity/pairs.entity';
import { Question } from '../../infrastructure/database/entity/question.entity';
import { User } from 'root/users/entity/user.entity';
import { AnswerStatuses, GameStatuses } from '../../@common/types/enum';
import { AnswersConverter } from '../../@common/utils/answers.converter';
import { BaseTransactionProvider } from 'root/@core/providers/transaction.provider';
import { FinishTheGameAfterDelayUseCase } from '../use-cases/finish-the-game-after-delay.use-case-';

type PlayerAnswer = {
  playerId: string;
  answer: string;
};

@Injectable()
export class PlayerAnswerTransaction extends BaseTransactionProvider<
  PlayerAnswer,
  AnswerDTO
> {
  public constructor(
    dataSource: DataSource,
    private readonly finishGame: FinishTheGameAfterDelayUseCase,
  ) {
    super(dataSource);
  }

  protected async execute(
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
      id: gameId,
      firstPlayer,
      secondPlayer,
      firstPlayerAnswers,
      secondPlayerAnswers,
    } = game;

    const isCurrentPlayerFirst = game.isPlayerFirst(Number(playerId));

    const questionsCount = game.questionsLength;

    if (isCurrentPlayerFirst) {
      if (firstPlayerAnswers.length === questionsCount) return null;
    } else {
      if (secondPlayerAnswers.length === questionsCount) return null;
    }

    let currentPlayerAnswers: AnswerDTO[] = [];
    let anotherPlayerAnswers: AnswerDTO[] = [];

    if (isCurrentPlayerFirst) {
      currentPlayerAnswers = game.firstPlayerAnswers;
      anotherPlayerAnswers = game.secondPlayerAnswers;
    } else {
      currentPlayerAnswers = game.secondPlayerAnswers;
      anotherPlayerAnswers = game.firstPlayerAnswers;
    }

    const currentQuestion = game.getCurrentQuestion(Number(playerId));

    const isCorrect = game.isAnswerCorrect(answer, currentQuestion);

    if (isCorrect) {
      if (isCurrentPlayerFirst) {
        game.firstPlayerScore++;
      } else {
        game.secondPlayerScore++;
      }
    }

    const isAnswerLast = game.isAnswerLast;

    if (isAnswerLast) {
      this.finishGame.abort(Number(playerId));

      game.status = GameStatuses.Finished;
      game.finishGameDate = new Date();

      const hasBonusPoint = anotherPlayerAnswers.some(
        (answer) => answer.answerStatus === AnswerStatuses.correct,
      );

      if (hasBonusPoint) {
        if (isCurrentPlayerFirst) {
          game.secondPlayerScore++;
        } else {
          game.firstPlayerScore++;
        }
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

    const isMyAnswerLast = currentPlayerAnswers.length === questionsCount;

    if (isMyAnswerLast && !isAnswerLast) {
      if (isCurrentPlayerFirst) {
        this.finishGame.execute(gameId, secondPlayer.id);
      } else {
        this.finishGame.execute(gameId, firstPlayer.id);
      }
    }

    await manager.save(game);

    return AnswersConverter.toDTO(newAnswer);
  }
}
