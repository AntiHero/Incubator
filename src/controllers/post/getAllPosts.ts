import { Request, Response } from 'express';

import Paginator from '@/models/Paginator';
import { PaginationQuery } from '@/@types';
import { convertToPost } from '@/utils/convertToPost';
import * as postsRepository from '@/repository/posts.repository';
import { validatePaginationQuery } from '@/customValidators/paginationValidator';

export const getAllPosts = [
  ...validatePaginationQuery,
  async (req: Request, res: Response) => {
    const { pageNumber, pageSize, sortBy, sortDirection, searchNameTerm } =
      req.query as unknown as PaginationQuery;

    const posts = await postsRepository.findPostsByQuery({
      pageNumber,
      pageSize,
      sortBy,
      sortDirection,
      searchNameTerm,
    });
    const totalCount = await postsRepository.getPostsCount();
    const items = posts.map(convertToPost);
    const result = new Paginator(
      Math.ceil(totalCount / pageSize),
      pageNumber,
      pageSize,
      totalCount,
      items
    );

    res.type('text/plain').status(200).send(JSON.stringify(result));
  },
];
