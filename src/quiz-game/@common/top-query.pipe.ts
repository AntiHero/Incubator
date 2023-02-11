import {
  Injectable,
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { SortDirection } from 'root/@common/types/enum';
import { BAD_QUERY_ERROR } from 'root/@common/error-messages';

import { Statistics } from '../types/enum';
import { TopUsersQuery, TopUsersSanitizedQuery } from '../types';

@Injectable()
export class TopQuerySanitizerPipe implements PipeTransform {
  async transform(value: Partial<TopUsersQuery>, metadata: ArgumentMetadata) {
    if (metadata.type !== 'query') return value;

    console.log(value);

    const defaultSort: [string, string][] = [
      [Statistics.avgScore, SortDirection.DESC],
      [Statistics.sumScore, SortDirection.DESC],
    ];

    let { pageNumber, pageSize, sort } = value;

    pageNumber = Number(pageNumber) || 1;
    pageSize = Number(pageSize) || 10;

    let sanitizedSort: [string, string][] = defaultSort;

    try {
      if (sort) {
        !Array.isArray(sort) && (sort = [sort]);

        sanitizedSort = sort.map((value) => {
          const [sort, sortDirection] = value.split(/\s/);

          const isSortCorrect = Object.values(Statistics).includes(
            <Statistics>sort,
          );

          const isSortDirectionCorrect = [
            SortDirection.ASC,
            SortDirection.DESC,
          ].includes(<SortDirection>sortDirection.toUpperCase());

          if (!isSortCorrect || !isSortDirectionCorrect) {
            throw new BadRequestException(BAD_QUERY_ERROR);
          }

          return [
            sort,
            <SortDirection>sortDirection.toUpperCase() === SortDirection.ASC
              ? SortDirection.ASC
              : SortDirection.DESC,
          ];
        });
      }
    } catch (err) {
      console.log(err);
    } finally {
      console.log(sanitizedSort);
      const sanitizedValue: TopUsersSanitizedQuery = {
        sort: sanitizedSort,
        pageNumber,
        pageSize,
      };

      return sanitizedValue;
    }
  }
}
