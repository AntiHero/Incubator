import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

import { PairsQuery } from '../types';
import { validateSortDirection } from 'root/@common/utils/validate-sort-direction';

@Injectable()
export class PairsQueryParsePipe implements PipeTransform {
  async transform(value: Partial<PairsQuery>, metadata: ArgumentMetadata) {
    if (metadata.type !== 'query') return value;

    let { pageNumber, pageSize, sortBy, sortDirection } = value;

    pageNumber = Number(pageNumber) || 1;
    pageSize = Number(pageSize) || 10;
    sortBy = sortBy || 'pairCreatedDate';
    sortDirection = validateSortDirection(sortDirection);

    const sanitizedValue: PairsQuery = {
      pageNumber,
      pageSize,
      sortBy,
      sortDirection,
    };

    return sanitizedValue;
  }
}
