import { DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { AnswerDTO } from 'root/quiz-game/@common/types';
import { User } from 'root/users/entity/user.entity';
import { Answer } from 'root/quiz-game/infrastructure/database/entity/answer.entity';
import { PairGame } from 'root/quiz-game/infrastructure/database/entity/pairs.entity';
import { Question } from 'root/quiz-game/infrastructure/database/entity/question.entity';
import {
  AnswerStatuses,
  GameStatuses,
} from 'root/quiz-game/@common/types/enum';

@Injectable()
export class FinishTheGameAfterDelayUseCase {
  public constructor(private readonly dataSource: DataSource) {}

  private timeout = 10_000;

  private timers: { [key: string]: NodeJS.Timeout } = {};

  private async finishGame(gameId: string, playerId: number) {
    try {
      const game = await this.dataSource.getRepository(PairGame).findOne({
        where: {
          id: gameId,
        },
      });

      const isPlayerFirst = game.isPlayerFirst(playerId);
      let currentPlayerAnswers: AnswerDTO[] = [];
      let anotherPlayerAnswers: AnswerDTO[] = [];

      if (isPlayerFirst) {
        currentPlayerAnswers = game.firstPlayerAnswers;
        anotherPlayerAnswers = game.secondPlayerAnswers;
      } else {
        currentPlayerAnswers = game.secondPlayerAnswers;
        anotherPlayerAnswers = game.firstPlayerAnswers;
      }

      for (
        let i = game.questionsLength - currentPlayerAnswers.length;
        i > 0;
        i--
      ) {
        const questionId = game.questions.at(-i).id;

        const newAnswer = Answer.create({
          question: <Question>{ id: Number(questionId) },
          player: <User>{ id: playerId },
          pairGame: <PairGame>{ id: gameId },
          answerStatus: AnswerStatuses.incorrect,
          addedAt: new Date(),
        });

        currentPlayerAnswers.push(newAnswer.toDTO());
      }

      game.status = GameStatuses.Finished;
      game.finishGameDate = new Date();

      const hasAnyCorrectAnswers = anotherPlayerAnswers.some(
        (answer) => answer.answerStatus === AnswerStatuses.correct,
      );

      if (hasAnyCorrectAnswers) {
        if (isPlayerFirst) {
          game.secondPlayerScore++;
        } else {
          game.firstPlayerScore++;
        }
      }

      await this.dataSource.getRepository(PairGame).save(game);
    } catch (err) {
      console.log(err);

      return null;
    }
  }

  public async abort(playerId: number) {
    clearTimeout(this.timers[playerId]);
    delete this.timers[playerId];
  }

  public execute(gameId: string, playerId: number) {
    this.timers[playerId] = setTimeout(() => {
      this.finishGame(gameId, playerId);
    }, this.timeout);
  }
}
