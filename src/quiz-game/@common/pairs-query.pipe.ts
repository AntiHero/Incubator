import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

import { PairsQuery } from '../types';
import { SortDirection } from 'root/@core/types/enum';

@Injectable()
export class PairsQueryParsePipe implements PipeTransform {
  async transform(value: Partial<PairsQuery>, metadata: ArgumentMetadata) {
    if (metadata.type !== 'query') return value;

    let { pageNumber, pageSize, sortBy, sortDirection } = value;

    pageNumber = Number(pageNumber) || 1;
    pageSize = Number(pageSize) || 10;
    sortBy = sortBy || 'pairCreatedDate';

    sortDirection = (
      sortDirection?.toLocaleLowerCase() === 'asc' ? 'ASC' : 'DESC'
    ) as SortDirection;

    const sanitizedValue: PairsQuery = {
      sortDirection,
      pageNumber,
      pageSize,
      sortBy,
    };

    return sanitizedValue;
  }
}
