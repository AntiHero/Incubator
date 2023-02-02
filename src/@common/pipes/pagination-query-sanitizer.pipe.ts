import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

import { PaginationQueryType } from '../types';
import { BanStatus, SortDirectionKeys } from '../types/enum';

@Injectable()
export class PaginationQuerySanitizerPipe implements PipeTransform {
  async transform(
    value: Partial<PaginationQueryType>,
    metadata: ArgumentMetadata,
  ) {
    if (metadata.type !== 'query') return value;

    const pageNumber = value.pageNumber ? Number(value.pageNumber) || 1 : 1;
    const pageSize = value.pageSize ? Number(value.pageSize) : 10;
    const sortBy = value.sortBy || 'createdAt';
    const sortDirection =
      value.sortDirection?.toLowerCase() === SortDirectionKeys.asc
        ? SortDirectionKeys.asc
        : SortDirectionKeys.desc;
    const searchLoginTerm = value.searchLoginTerm
      ? value.searchLoginTerm
      : '.*';
    const searchEmailTerm = value.searchEmailTerm
      ? value.searchEmailTerm
      : '.*';
    const searchNameTerm = value.searchNameTerm ? value.searchNameTerm : '.*';

    const banStatus = Object.keys(BanStatus).includes(value.banStatus)
      ? value.banStatus
      : BanStatus.all;

    const sanitizedvalue: PaginationQueryType = {
      pageNumber,
      pageSize,
      sortBy,
      sortDirection,
      searchLoginTerm,
      searchEmailTerm,
      searchNameTerm,
      banStatus,
    };

    return sanitizedvalue;
  }
}
