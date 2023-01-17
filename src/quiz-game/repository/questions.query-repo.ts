import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';

import { PublishedStatus } from '../types/enum';
import { Question } from '../entity/question.entity';
import { countSkip } from 'root/@common/utils/count-skip';
import { QuestionDTOModel, QuestionPaginationQuery } from '../types';

@Injectable()
export class QuestionsQueryProvider {
  constructor(
    @InjectRepository(Question)
    private readonly questionsRepo: Repository<Question>,
  ) {}

  async findQuestionsByQuery(
    query: QuestionPaginationQuery,
  ): Promise<[number, QuestionDTOModel[]]> {
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
}
