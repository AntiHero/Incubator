import { Injectable } from '@nestjs/common';

import { Answer } from '../entity/answer.entity';
import { Question } from '../entity/question.entity';
import { QuestionsService } from './questions.service';
import { UsersService } from 'root/users/users.service';
import { AnswerStatuses, GameStatuses } from '../types/enum';
import { GamePairDTO, GamePayload, PairsQuery } from '../types';
import { PairsRepository } from '../infrastructure/repositories/pairs.repository';
import { PairsQueryRepository } from '../infrastructure/repositories/pairs.query.repository';
import { QUESTIONS_LIMIT } from 'root/@core/constants';

@Injectable()
export class PairsService {
  public constructor(
    private readonly usersService: UsersService,
    private readonly pairsRepository: PairsRepository,
    private readonly questionsService: QuestionsService,
    private readonly pairsQueryRepository: PairsQueryRepository,
  ) {}
  public async getMyCurrentGame(
    userId: string,
    activeOnly?: boolean,
  ): Promise<GamePairDTO> {
    const currentGame = await this.pairsQueryRepository.getCurrentGame(
      userId,
      activeOnly,
    );

    if (!currentGame) return null;

    return currentGame;
  }

  public async getFinishedGameById(gameId: string): Promise<GamePairDTO> {
    return this.getGameById(gameId);
  }

  public async getGameById(
    gameId: string,
    gameStatus?: { status?: GameStatuses },
  ): Promise<GamePairDTO> {
    if (!gameStatus) gameStatus = {};

    const game = await this.pairsQueryRepository.getGameById(
      gameId,
      gameStatus,
    );

    if (!game) return null;

    return game;
  }

  public async getMyGames(
    userId: number,
    query: PairsQuery,
  ): Promise<[GamePairDTO[], number]> {
    return this.pairsQueryRepository.getMyGames(userId, query);
  }

  public async createConnection(userId: string): Promise<GamePairDTO> {
    try {
      const { id, login } = await this.usersService.findUserById(userId);

      let game = await this.pairsRepository.findPendingGameAndConnect(id);

      if (!game) {
        const gamePayload: GamePayload = {
          firstPlayer: { id, login },
        };

        game = await this.pairsRepository.createNewGame(gamePayload);
      } else {
        const questions = await this.questionsService.getRandomQuestions(
          QUESTIONS_LIMIT,
        );

        game.questions = questions;

        await this.pairsRepository.addQuestions(game.id, questions);
      }

      return game;
    } catch (error) {
      console.log(error);

      return null;
    }
  }

  public async deleteAllPairGames() {
    return this.pairsRepository.deleteAllGames();
  }

  public getCurrentPlayerAnswers(userId: string, answers: Answer[]) {
    const userAnswers = answers.filter(
      (answer) => answer.player.id === Number(userId),
    );

    return userAnswers;
  }

  public isAnswerCorrect(answer: string, { correctAnswers }: Question) {
    return correctAnswers.includes(answer);
  }

  public isAnswerLast(
    { length: answersLen }: Answer[],
    { length: questionLen }: Question[],
  ) {
    return answersLen === questionLen * 2 - 1;
  }

  public playerHasCorrectAnswers(answers: Answer[]) {
    return answers.filter(
      (answer) => answer.answerStatus === AnswerStatuses.correct,
    );
  }
}
