import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

import { PaginationQuery, PaginationQueryType } from '../types';
import { SortDirectionKeys, SortDirections } from '../types/enum';

@Injectable()
export class PaginationQuerySanitizerPipe implements PipeTransform {
  async transform(value, metadata: ArgumentMetadata) {
    if (metadata.type !== 'query') return value;

    const pageNumber = value.pageNumber ? Number(value.pageNumber) || 1 : 1;
    const pageSize = value.pageSize ? Number(value.pageSize) : 10;
    const sortBy = value.sortBy || 'createdAt';
    const sortDirection =
      value.sortDirection === SortDirectionKeys.asc
        ? SortDirections.asc
        : SortDirections.desc;
    const searchLoginTerm = value.searchLoginTerm
      ? new RegExp(value.searchLoginTerm, 'i')
      : /.*/i;
    const searchEmailTerm = value.searchEmailTerm
      ? new RegExp(value.searchEmailTerm, 'i')
      : /.*/i;
    const searchNameTerm = value.searchNameTerm
      ? new RegExp(value.searchNameTerm, 'i')
      : /.*/i;

    const sanitizedvalue: PaginationQuery = {
      pageNumber,
      pageSize,
      sortBy,
      sortDirection,
      searchLoginTerm,
      searchEmailTerm,
      searchNameTerm,
    };

    return sanitizedvalue;
  }
}

@Injectable()
export class PaginationQuerySanitizer implements PipeTransform {
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

    const sanitizedvalue: PaginationQueryType = {
      pageNumber,
      pageSize,
      sortBy,
      sortDirection,
      searchLoginTerm,
      searchEmailTerm,
      searchNameTerm,
    };

    return sanitizedvalue;
  }
}
