import { DataSource } from 'typeorm';
import { EntityManager } from 'typeorm';
import { Injectable } from '@nestjs/common';

import { Answer } from '../entity/answer.entity';
import { Question } from '../entity/question.entity';
import { User } from 'root/users/entity/user.entity';
import { PairGame } from '../entity/pairs.entity';
import { AnswerStatuses, GameStatuses } from '../types/enum';
import { PairsService } from '../services/pairs.service';
import { AnswersRepository } from '../infrastructure/repositories/answers.repository';
import { BaseTransactionProvider } from 'root/@common/providers/transaction.provider';
import { PairsRepository } from '../infrastructure/repositories/pairs.repository';

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
      .where([
        { firstPlayer: { id: Number(playerId) }, status: GameStatuses.active },
        { secondPlayer: { id: Number(playerId) }, status: GameStatuses.active },
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
      firstPlayer: { id: firstPlayerId },
      secondPlayer: { id: secondPlayerId },
    } = game;

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

    const userAnswers = this.gamesPairService.getCurrentPlayerAnswers(
      playerId,
      answers,
    );

    const currentQuestion = questions[userAnswers.length];

    const isCorrect = this.gamesPairService.isAnswerCorrect(
      answer,
      currentQuestion,
    );

    isCorrect && game.increasePlayerScore(Number(playerId));

    const isLast = this.gamesPairService.isAnswerLast(answers, questions);

    if (isLast) {
      game.changeStatus(GameStatuses.finished);
      game.finishGameDate = new Date();

      if (this.gamesPairService.playerHasCorrectAnswers(userAnswers)) {
        const playerIdForBonus =
          Number(playerId) === firstPlayerId ? secondPlayerId : firstPlayerId;

        game.increasePlayerScore(playerIdForBonus);
      }
    }

    await this.pairsRepository.updateGame(
      {
        id: gameId,
        status: game.status,
        finishGameDate: game.finishGameDate,
        firstPlayerScore: game.firstPlayerScore,
        secondPlayerScore: game.secondPlayerScore,
      },
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
