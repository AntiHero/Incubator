import { query } from 'express-validator';
import { NextFunction, Request, Response } from 'express';

import {
  PaginationQueryParams,
  PostFields,
  SortDirection,
  SortDirectionKeys,
} from '@/enums';
import { PaginationQuery } from '@/@types';

export const validatePaginationQuery = [
  query(PaginationQueryParams.pageNumber)
    .trim()
    .toInt()
    .default(1),
  query(PaginationQueryParams.pageSize)
    .trim()
    .toInt()
    .default(10),
  async (req: Request, _: Response, next: NextFunction) => {
    const sortByResult = await query(PaginationQueryParams.sortBy)
      .isString()
      .trim()
      .toLowerCase()
      .run(req, { dryRun: true });

    if (!sortByResult.isEmpty()) {
      req.query.sortBy = PostFields.createdAt;
    }

    next();
  },
  async (req: Request, _: Response, next: NextFunction) => {
    const sortByResult = await query(PaginationQueryParams.sortDirection)
      .trim()
      .toLowerCase()
      .isIn(Object.keys(SortDirection))
      .run(req, { dryRun: true });

    if (!sortByResult.isEmpty()) {
      ((req.query as unknown) as PaginationQuery).sortDirection =
        SortDirection.desc;
    } else {
      ((req.query as unknown) as PaginationQuery).sortDirection =
        req.query.sortDirection === SortDirectionKeys.asc
          ? SortDirection.asc
          : SortDirection.desc;
    }

    next();
  },
  async (req: Request, _: Response, next: NextFunction) => {
    const searchNameTerm = await query(PaginationQueryParams.searchNameTerm)
      .isString()
      .trim()
      .toLowerCase()
      .run(req, { dryRun: true });

    if (!searchNameTerm.isEmpty()) {
      ((req.query as unknown) as PaginationQuery).searchNameTerm = /.*/i;
    } else {
      ((req.query as unknown) as PaginationQuery).searchNameTerm = new RegExp(req.query.searchNameTerm as string, 'i');
    }

    next();
  },
];
