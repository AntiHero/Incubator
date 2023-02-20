import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';

import {
  QuestionDTO,
  QuestionPaginationQuery,
} from 'root/quiz-game/types/index';
import { countSkip } from 'root/@core/utils/count-skip';
import { PublishedStatus } from 'root/quiz-game/types/enum';
import { Question } from 'root/quiz-game/entity/question.entity';

@Injectable()
export class QuestionsQueryProvider {
  constructor(
    @InjectRepository(Question)
    private readonly questionsRepo: Repository<Question>,
  ) {}

  public async findQuestionsByQuery(
    query: QuestionPaginationQuery,
  ): Promise<[number, QuestionDTO[]]> {
    const filter: FindOptionsWhere<Question> = {
      body: ILike('%' + query.searchBodyTerm + '%'),
    };

    const publishedStatus =
      query.publishedStatus === PublishedStatus.notPublished
        ? false
        : PublishedStatus.published
        ? true
        : undefined;

    void typeof publishedStatus === 'boolean' &&
      (filter.published = publishedStatus);

    const count = await this.questionsRepo.count({
      where: filter,
    });

    const { sortBy, sortDirection, pageSize, pageNumber } = query;

    const questions = await this.questionsRepo.find({
      where: filter,
      order: {
        [sortBy]: `${
          sortBy === 'createdAt'
            ? sortDirection
            : 'COLLATE "C" ' + sortDirection
        }`,
      },
      skip: countSkip(pageSize, pageNumber),
      take: pageSize,
    });

    return [count, questions.map((q) => q.toDTO())];
  }

  public async getAllQuestions(): Promise<QuestionDTO[]> {
    try {
      const questions = await this.questionsRepo.find();

      return questions.map((question) => question.toDTO());
    } catch (error) {
      console.log(error);

      return null;
    }
  }

  public async getRandomQuestions(limit?: number): Promise<QuestionDTO[]> {
    try {
      const questions = await this.questionsRepo
        .createQueryBuilder('questions')
        .where('questions.published = :published', { published: true })
        .orderBy('RANDOM()')
        .take(limit)
        .getMany();

      return questions.map((question) => question.toDTO());
    } catch (error) {
      console.log(error);

      return null;
    }
  }
}
