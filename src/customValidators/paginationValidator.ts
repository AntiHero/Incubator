import { query } from 'express-validator';
import { NextFunction, Request, Response } from 'express';

import {
  PaginationQueryParams,
  PostFields,
  SortDirection,
  SortDirectionKeys,
} from '@/enums';
import { PaginationQuery } from '@/@types';

type SearchTerms =
  | PaginationQueryParams.searchNameTerm
  | PaginationQueryParams.searchEmailTerm
  | PaginationQueryParams.searchLoginTerm;

const validateQueryString = (queryParam: string) =>
  query(queryParam)
    .isString()
    .trim()
    .toLowerCase();

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
    const dryRun = true;

    const terms = await Promise.all([
      validateQueryString(PaginationQueryParams.searchNameTerm).run(req, {
        dryRun,
      }),
      validateQueryString(PaginationQueryParams.searchLoginTerm).run(req, {
        dryRun,
      }),
      validateQueryString(PaginationQueryParams.searchEmailTerm).run(req, {
        dryRun,
      }),
    ]);

    for (const term of terms) {
      const field = term.context.fields[0] as SearchTerms;

      if (!term.isEmpty()) {
        ((req.query as unknown) as PaginationQuery)[field] = /.*/i;
      } else {
        if (field === PaginationQueryParams.searchNameTerm) {
          ((req.query as unknown) as PaginationQuery).searchNameTerm = new RegExp(
            req.query.searchNameTerm as string,
            'i'
          );
        } else {
          ((req.query as unknown) as PaginationQuery)[field] = new RegExp(
            (('^' + req.query[field]) as string) + '.*',
            'i'
          );
        }
      }

      console.log(req.query);
    }

    next();
  },
];
