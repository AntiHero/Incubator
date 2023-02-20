import { DataSource } from 'typeorm';
import { PlayerData } from '../types';
import { Injectable } from '@nestjs/common';
import { User } from 'root/users/entity/user.entity';
import { GameStatuses } from 'root/quiz-game/types/enum';
import questionsData from 'root/@core/data/questions.json';
import { PairGame } from 'root/quiz-game/entity/pairs.entity';
import { Question } from 'root/quiz-game/entity/question.entity';
import { QuestionsConverter } from 'root/quiz-game/utils/questions.converter';

@Injectable()
export class SeedProvider {
  constructor(private readonly dataSource: DataSource) {}

  async createNewGame(): Promise<[PlayerData, PlayerData, string[][]]> {
    try {
      const firstPlayerData = {
        login: 'player1',
        password: 'test1234',
        email: 'player1@gmail.com',
      };

      const player1 = await User.createUser(firstPlayerData);

      const secondPlayerData = {
        login: 'player2',
        password: 'test1234',
        email: 'player2@gmail.com',
      };

      const player2 = await User.createUser(secondPlayerData);

      const questions: Question[] = [];

      for (let i = 0; i < 5; i++) {
        const questionsEntries = Object.entries(questionsData);

        const [questionBody, answers] =
          questionsEntries[Math.floor(Math.random() * questionsEntries.length)];

        const newQuestion = new Question();

        newQuestion.id = Math.floor(Math.random() * 100);
        newQuestion.body = questionBody;
        newQuestion.correctAnswers = answers;
        newQuestion.published = true;
        newQuestion.createdAt = new Date();
        newQuestion.updatedAt = new Date();

        questions.push(newQuestion);
      }

      const newGame = new PairGame();

      newGame.questions = questions.map(QuestionsConverter.toDTO);
      newGame.firstPlayer = <User>{ id: player1.id };
      newGame.secondPlayer = <User>{ id: player2.id };
      newGame.status = GameStatuses.Active;
      newGame.startGameDate = new Date();

      await this.dataSource.getRepository(PairGame).save(newGame);

      return [
        firstPlayerData,
        secondPlayerData,
        questions.map((q) => q.correctAnswers),
      ];
    } catch (err) {
      console.log(err);

      return null;
    }
  }
}
