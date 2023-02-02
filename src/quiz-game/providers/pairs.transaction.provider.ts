import { DataSource } from 'typeorm';
import { EntityManager } from 'typeorm';
import { Injectable } from '@nestjs/common';

import { GameUpdates } from '../types';
import { Answer } from '../entity/answer.entity';
import { PairGame } from '../entity/pairs.entity';
import { Question } from '../entity/question.entity';
import { User } from 'root/users/entity/user.entity';
import { PairsService } from '../services/pairs.service';
import { AnswerStatuses, GameStatuses } from '../types/enum';
import { PairsRepository } from '../infrastructure/repositories/pairs.repository';
import { AnswersRepository } from '../infrastructure/repositories/answers.repository';
import { BaseTransactionProvider } from 'root/@common/providers/transaction.provider';

type PlayerAnswer = {
  playerId: string;
  answer: string;
};

@Injectable()
export class PlayerAnswerTransaction extends BaseTransactionProvider<
  PlayerAnswer,
  Answer
> {
  public constructor(
    dataSource: DataSource,
    private readonly gamesPairService: PairsService,
    private readonly pairsRepository: PairsRepository,
    private readonly answersRepository: AnswersRepository,
  ) {
    super(dataSource);
  }

  protected async execute(
    { playerId, answer }: PlayerAnswer,
    manager: EntityManager,
  ) {
    const game = await manager
      .createQueryBuilder(PairGame, 'pairs')
      .setLock('pessimistic_write', undefined, ['pairs'])
      // .setLock('pessimistic_write')
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
      firstPlayerScore,
      secondPlayerScore,
      // firstPlayer: { id: firstPlayerId },
      // secondPlayer: { id: secondPlayerId },
      firstPlayerCurrentAnswerNum,
      secondPlayerCurrentAnswerNum,
    } = game;

    const isCurrentPlayerFirst = Number(playerId) === game.firstPlayer.id;

    if (isCurrentPlayerFirst) {
      if (firstPlayerCurrentAnswerNum === questions.length) {
        return null;
      }
    } else {
      if (secondPlayerCurrentAnswerNum === questions.length) {
        return null;
      }
    }

    // const answers = await manager
    //   .createQueryBuilder(Answer, 'answers')
    //   .where({
    //     pairGame: {
    //       id: gameId,
    //     },
    //   })
    //   .setFindOptions({
    //     relations: {
    //       player: true,
    //     },
    //   })
    //   .getMany();

    // const userAnswers = this.gamesPairService.getCurrentPlayerAnswers(
    //   playerId,
    //   answers,
    // );

    // const currentQuestion = questions[userAnswers.length];
    const gameUpdates: GameUpdates = { id: gameId };

    const currentQuestion =
      questions[
        isCurrentPlayerFirst
          ? firstPlayerCurrentAnswerNum
          : secondPlayerCurrentAnswerNum
      ];

    const isCorrect = this.gamesPairService.isAnswerCorrect(
      answer,
      currentQuestion,
    );

    // isCorrect && game.increasePlayerScore(Number(playerId));
    if (isCorrect) {
      if (isCurrentPlayerFirst) {
        gameUpdates.firstPlayerScore = firstPlayerScore + 1;
      } else {
        gameUpdates.secondPlayerScore = secondPlayerScore + 1;
      }
    }

    // const isAnswerLast = this.gamesPairService.isAnswerLast(answers, questions);
    let isAnswerLast: boolean;

    if (isCurrentPlayerFirst) {
      isAnswerLast =
        firstPlayerCurrentAnswerNum === questions.length - 1 &&
        secondPlayerCurrentAnswerNum === questions.length;
    } else {
      isAnswerLast =
        secondPlayerCurrentAnswerNum === questions.length - 1 &&
        firstPlayerCurrentAnswerNum === questions.length;
    }

    if (isAnswerLast) {
      // game.changeStatus(GameStatuses.Finished);
      // game.finishGameDate = new Date();
      gameUpdates.status = GameStatuses.Finished;
      gameUpdates.finishGameDate = new Date();

      const answers = await manager
        .createQueryBuilder(Answer, 'answers')
        .where({
          pairGame: {
            id: gameId,
          },
        })
        .setFindOptions({
          relations: {
            player: true,
          },
        })
        .getMany();

      const anotherPlayerAnswersHasCorrectAnswers = answers.some(
        (answer) =>
          answer.player.id !== Number(playerId) &&
          answer.answerStatus === AnswerStatuses.correct,
      );

      if (anotherPlayerAnswersHasCorrectAnswers) {
        if (isCurrentPlayerFirst) {
          gameUpdates.secondPlayerScore = secondPlayerScore + 1;
        } else {
          gameUpdates.firstPlayerScore = firstPlayerScore + 1;
        }
      }

      // if (this.gamesPairService.playerHasCorrectAnswers(userAnswers)) {
      //   const playerIdForBonus =
      //     Number(playerId) === firstPlayerId ? secondPlayerId : firstPlayerId;

      //   game.increasePlayerScore(playerIdForBonus);
      // }
    }

    if (isCurrentPlayerFirst) {
      gameUpdates.firstPlayerCurrentAnswerNum = firstPlayerCurrentAnswerNum + 1;
    } else {
      gameUpdates.secondPlayerCurrentAnswerNum =
        secondPlayerCurrentAnswerNum + 1;
    }

    await this.pairsRepository.updateGame(
      // {
      //   id: gameId,
      //   status: game.status,
      //   finishGameDate: game.finishGameDate,
      //   firstPlayerScore: game.firstPlayerScore,
      //   secondPlayerScore: game.secondPlayerScore,
      //   firstPlayerCurrentAnswerNum: game.firstPlayerCurrentAnswerNum,
      //   secondPlayerCurrentAnswerNum: game.secondPlayerCurrentAnswerNum,
      // },
      gameUpdates,
      manager,
    );

    const { id: questionId } = currentQuestion;

    const answerStatus = isCorrect
      ? AnswerStatuses.correct
      : AnswerStatuses.incorrect;

    const newAnswer = Answer.create({
      question: <Question>{ id: Number(questionId) },
      player: <User>{ id: Number(playerId) },
      pairGame: <PairGame>{ id: gameId },
      answerStatus,
    });

    return this.answersRepository.createAnswer(newAnswer, manager);
  }
}
