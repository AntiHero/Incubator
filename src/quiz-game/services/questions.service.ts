import { Injectable } from '@nestjs/common';

import { QuestionsProvider } from '../infrastructure/repositories/questions.repository';
import { QuestionInputModel, QuestionPaginationQuery } from '../types';
import { QuestionsQueryProvider } from '../infrastructure/repositories/questions.query.repository';

@Injectable()
export class QuestionsService {
  public constructor(
    private readonly questionsRepo: QuestionsProvider,
    private readonly questionsQueryRepo: QuestionsQueryProvider,
  ) {}

  public async createQuestion(data: QuestionInputModel) {
    return this.questionsRepo.create(data);
  }

  public async getAllQuestions() {
    return this.questionsQueryRepo.getAllQuestions();
  }

  public async getRandomQuestions(limit?: number) {
    return this.questionsQueryRepo.getRandomQuestions(limit);
  }

  public async findQuestionsByQuery(query: QuestionPaginationQuery) {
    return this.questionsQueryRepo.findQuestionsByQuery(query);
  }

  public async findQuestionByIdAndDelete(id: string) {
    return this.questionsRepo.findByIdAndDelete(id);
  }

  public async findQuestionByIdAndUpdate(
    id: string,
    updates: QuestionInputModel,
  ) {
    return this.questionsRepo.findByIdAndUpdate(id, updates);
  }

  public async updatePublishedStatus(id: string, published: boolean) {
    return this.questionsRepo.updatePublishedStatus(id, published);
  }

  public async deleteAllQuestions() {
    return this.questionsRepo.deleteAll();
  }
}
