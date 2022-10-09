import { query } from 'express-validator';
import { NextFunction, Request, Response } from 'express';

import {
  PaginationQueryParams,
  PostFields,
  SortDirection,
  SortDirectionKeys,
} from '@/enums';
import { PaginationQuery } from '@/@types';

const validateQueryString = (queryParam: string) =>
  query(queryParam).isString().trim().toLowerCase();

export const validatePaginationQuery = [
  query(PaginationQueryParams.pageNumber).trim().toInt().default(1),
  query(PaginationQueryParams.pageSize).trim().toInt().default(10),
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
      (req.query as unknown as PaginationQuery).sortDirection =
        SortDirection.desc;
    } else {
      (req.query as unknown as PaginationQuery).sortDirection =
        req.query.sortDirection === SortDirectionKeys.asc
          ? SortDirection.asc
          : SortDirection.desc;
    }

    next();
  },
  async (req: Request, _: Response, next: NextFunction) => {
    const dryRun = true;
    
    const [searchNameTerm, searchLoginTerm, searchEmailTerm] =
      await Promise.all([
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

    if (!searchNameTerm.isEmpty()) {
      (req.query as unknown as PaginationQuery).searchNameTerm = /.*/i;
    } else {
      (req.query as unknown as PaginationQuery).searchNameTerm = new RegExp(
        req.query.searchNameTerm as string,
        'i'
      );
    }

    if (!searchLoginTerm.isEmpty()) {
      (req.query as unknown as PaginationQuery).searchLoginTerm = /.*/i;
    } else {
      (req.query as unknown as PaginationQuery).searchLoginTerm = new RegExp(
        (('^' + req.query.searchLoginTerm) as string) + '.*',
        'i'
      );
    }

    if (!searchEmailTerm.isEmpty()) {
      (req.query as unknown as PaginationQuery).searchEmailTerm = /.*/i;
    } else {
      (req.query as unknown as PaginationQuery).searchEmailTerm = new RegExp(
        '^' + (req.query.searchEmailTerm as string) + '.*',
        'i'
      );
    }

    next();
  },
];
