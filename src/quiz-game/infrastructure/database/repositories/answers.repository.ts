import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

import { Answer } from 'root/quiz-game/infrastructure/database/entity/answer.entity';

@Injectable()
export class AnswersRepository {
  public constructor(
    @InjectRepository(Answer)
    private readonly answersRepository: Repository<Answer>,
  ) {}

  public async deleteAllAnswers() {
    try {
      await this.answersRepository.delete({});
    } catch (error) {
      console.log(error);

      return null;
    }
  }

  public async createAnswer(answer: Answer, manager: EntityManager) {
    try {
      const savedAnswer = await manager.save(answer);

      return savedAnswer;
    } catch (error) {
      console.log(error);

      return null;
    }
  }
}
