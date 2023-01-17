import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { QuestionInputModel } from '../../types';
import { Question } from '../../entity/question.entity';

@Injectable()
export class QuestionsProvider {
  public constructor(
    @InjectRepository(Question)
    private readonly questionsRepo: Repository<Question>,
  ) {}

  public async create(data: QuestionInputModel) {
    const { body, correctAnswers } = data;

    try {
      if (typeof body !== 'string' || !(correctAnswers instanceof Array)) {
        throw new Error('Wrong input data');
      }

      const question = new Question();

      question.body = body;
      question.correctAnswers = correctAnswers;
      question.updatedAt = null;

      const savedQuestion = await this.questionsRepo.save(question);

      return savedQuestion.toDTO();
    } catch (error) {
      console.log(error);

      return null;
    }
  }

  public async findByIdAndDelete(id: string) {
    try {
      const result = await this.questionsRepo
        .createQueryBuilder()
        .delete()
        .from(Question)
        .where('id = :id', { id })
        .returning('id')
        .execute();

      return !!result.affected;
    } catch (error) {
      console.log(error);

      return null;
    }
  }

  public async findByIdAndUpdate(id: string, updates: QuestionInputModel) {
    try {
      const result = await this.questionsRepo
        .createQueryBuilder()
        .update(Question)
        .set(updates)
        .where('id = :id', { id })
        .returning('id')
        .execute();

      return !!result.affected;
    } catch (error) {
      console.log(error);

      return null;
    }
  }

  public async updatePublishedStatus(id: string, published: boolean) {
    try {
      const result = await this.questionsRepo
        .createQueryBuilder()
        .update(Question)
        .set({ published })
        .where('id = :id', { id })
        .returning('id')
        .execute();

      return !!result.affected;
    } catch (error) {
      console.log(error);

      return null;
    }
  }

  public async deleteAll() {
    try {
      await this.questionsRepo
        .createQueryBuilder()
        .delete()
        .from(Question)
        .execute();
    } catch (error) {
      console.log(error);

      return null;
    }
  }
}
