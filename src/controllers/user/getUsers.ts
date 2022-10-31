import { Request, Response } from 'express';

import Paginator from '@/models/Paginator';
import { PaginationQuery } from '@/@types';
import * as usersService from '@/app/users.service';
import { convertToUser } from '@/utils/convertToUser';
// import * as usersRepository from '@/repository/users.repository';
import { validatePaginationQuery } from '@/customValidators/paginationValidator';

export const getUsers = [
  ...validatePaginationQuery,
  async (req: Request, res: Response) => {
    const {
      pageNumber,
      pageSize,
      sortBy,
      sortDirection,
      searchLoginTerm,
      searchEmailTerm,
    } = (req.query as unknown) as PaginationQuery;

    // const users = await usersRepository.findUsersByQuery(
    //   {
    //   pageNumber,
    //   pageSize,
    //   sortBy,
    //   sortDirection,
    //   searchLoginTerm,
    //   searchEmailTerm,
    // }
    // );

    const users = await usersService.findUsersByQuery({
      pageNumber,
      pageSize,
      sortBy,
      sortDirection,
      searchLoginTerm,
      searchEmailTerm,
    });

    // const totalCount = await usersRepository.getUsersCount(req.query);
    const totalCount = await usersService.getUsersCount(req.query);
    const items = users.map(convertToUser);
    const result = new Paginator(
      Math.ceil(totalCount / pageSize),
      pageNumber,
      pageSize,
      totalCount,
      items
    );

    res
      .type('text/plain')
      .status(200)
      .send(JSON.stringify(result));
  },
];
