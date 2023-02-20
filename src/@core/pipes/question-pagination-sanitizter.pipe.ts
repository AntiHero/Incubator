import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

import { SortDirectionKeys } from '../types/enum';
import { PublishedStatus } from 'root/quiz-game/@common/types/enum';
import { QuestionPaginationQuery } from 'root/quiz-game/@common/types';

@Injectable()
export class QuestionQuerySanitizerPipe implements PipeTransform {
  async transform(
    value: Partial<QuestionPaginationQuery>,
    metadata: ArgumentMetadata,
  ) {
    if (metadata.type !== 'query') return value;

    const pageNumber = Number(value.pageNumber) || 1;

    const pageSize = Number(value.pageSize) || 10;

    const sortBy = value.sortBy || 'createdAt';

    const sortDirection =
      value.sortDirection?.toLowerCase() === SortDirectionKeys.asc
        ? SortDirectionKeys.asc
        : SortDirectionKeys.desc;

    // const searchBodyTerm = value.searchBodyTerm || '.*';
    const searchBodyTerm = value.searchBodyTerm || '%';

    const publishedStatus = Object.values(PublishedStatus).includes(
      value.publishedStatus?.toLocaleLowerCase() as any,
    )
      ? value.publishedStatus
      : PublishedStatus.all;

    const sanitizedQuery: QuestionPaginationQuery = {
      pageNumber,
      pageSize,
      sortBy,
      sortDirection,
      searchBodyTerm,
      publishedStatus,
    };

    return sanitizedQuery;
  }
}
