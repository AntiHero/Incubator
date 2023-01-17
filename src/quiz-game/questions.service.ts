import { Injectable } from '@nestjs/common';

import { QuestionsProvider } from './repository/questions.repo';
import { QuestionInputModel, QuestionPaginationQuery } from './types';
import { QuestionsQueryProvider } from './repository/questions.query-repo';

@Injectable()
export class QuestionsService {
  constructor(
    private readonly questionsRepo: QuestionsProvider,
    private readonly questionsQueryRepo: QuestionsQueryProvider,
  ) {}

  async createQuestion(data: QuestionInputModel) {
    return this.questionsRepo.create(data);
  }

  async findQuestionsByQuery(query: QuestionPaginationQuery) {
    return this.questionsQueryRepo.findQuestionsByQuery(query);
  }

  async findQuestionByIdAndDelete(id: string) {
    return this.questionsRepo.findByIdAndDelete(id);
  }

  async findQuestionByIdAndUpdate(id: string, updates: QuestionInputModel) {
    return this.questionsRepo.findByIdAndUpdate(id, updates);
  }

  async updatePublishedStatus(id: string, published: boolean) {
    return this.questionsRepo.updatePublishedStatus(id, published);
  }
}
