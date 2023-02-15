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
      firstPlayerScore,
      secondPlayerScore,
      firstPlayerAnswers,
      secondPlayerAnswers,
    } = game;
    console.log(firstPlayerAnswers, secondPlayerAnswers);

    const isCurrentPlayerFirst = game.isPlayerFirst(Number(playerId));

    const questionsCount = game.questionsLength;

    if (isCurrentPlayerFirst) {
      if (firstPlayerAnswers.length === questionsCount) return null;
    } else {
      if (secondPlayerAnswers.length === questionsCount) return null;
    }

    // let currentPlayerScore = 0;
    // let anotherPlayerScore = 0;

    // let currentPlayerAnswers: AnswerDTO[] = [];
    // let anotherPlayerAnswers: AnswerDTO[] = [];
    let currentPlayerAnswers: AnswerDTO[] = [];
    let anotherPlayerAnswers: AnswerDTO[] = [];

    if (isCurrentPlayerFirst) {
      currentPlayerAnswers = game.firstPlayerAnswers;
      anotherPlayerAnswers = game.secondPlayerAnswers;
    } else {
      currentPlayerAnswers = game.secondPlayerAnswers;
      anotherPlayerAnswers = game.firstPlayerAnswers;
    }

    // if (isCurrentPlayerFirst) {
    //   currentPlayerScore = firstPlayerScore;
    //   currentPlayerAnswers = firstPlayerAnswers;

    //   anotherPlayerScore = secondPlayerScore;
    //   anotherPlayerAnswers = secondPlayerAnswers;
    // } else {
    //   currentPlayerScore = secondPlayerScore;
    //   currentPlayerAnswers = secondPlayerAnswers;

    //   anotherPlayerScore = firstPlayerScore;
    //   anotherPlayerAnswers = firstPlayerAnswers;
    // }

    // const gameUpdates: GameUpdates = { id: gameId };

    const currentQuestion = game.getCurrentQuestion(Number(playerId));

    const isCorrect = game.isAnswerCorrect(answer, currentQuestion);

    if (isCorrect) {
      if (isCurrentPlayerFirst) {
        game.firstPlayerScore++;
        // gameUpdates.firstPlayerScore = ++currentPlayerScore;
      } else {
        game.secondPlayerScore++;
        // gameUpdates.secondPlayerScore = ++currentPlayerScore;
      }
    }

    const isAnswerLast = game.isAnswerLast;

    if (isAnswerLast) {
      this.finishGame.abort(Number(playerId));

      game.status = GameStatuses.Finished;
      game.finishGameDate = new Date();
      // gameUpdates.status = GameStatuses.Finished;
      // gameUpdates.finishGameDate = new Date();
    }

    // const hasBonusPoint = anotherPlayerAnswers.some(
    //   (answer) => answer.answerStatus === AnswerStatuses.correct,
    // );

    if (isAnswerLast) {
      const hasBonusPoint = anotherPlayerAnswers.some(
        (answer) => answer.answerStatus === AnswerStatuses.correct,
      );

      if (hasBonusPoint) {
        if (isCurrentPlayerFirst) {
          game.secondPlayerScore++;
          // gameUpdates.secondPlayerScore = ++anotherPlayerScore;
        } else {
          game.firstPlayerScore++;
          // gameUpdates.firstPlayerScore = ++currentPlayerScore;
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

    // currentPlayerAnswers.push()
    // if (isCurrentPlayerFirst) {
    //   gameUpdates.firstPlayerAnswers = currentPlayerAnswers;
    // } else {
    //   gameUpdates.secondPlayerAnswers = currentPlayerAnswers;
    // }

    const isMyAnswerLast = currentPlayerAnswers.length === questionsCount;

    if (isMyAnswerLast && !isAnswerLast) {
      if (isCurrentPlayerFirst) {
        this.finishGame.execute(gameId, secondPlayer.id);
      } else {
        this.finishGame.execute(gameId, firstPlayer.id);
      }
    }

    await manager.save(game);
    // await manager
    //   .createQueryBuilder(PairGame, 'pairs')
    //   .update()
    //   .set(game)
    //   .where({
    //     id: gameId,
    //   })
    //   .execute();
    // await this.pairsRepository.updateGame(gameUpdates, manager);

    return AnswersConverter.toDTO(newAnswer);
  }
}
