import { Request, Response } from 'express';

import Paginator from '@/models/Paginator';
import { PaginationQuery } from '@/@types';
import { convertToPost } from '@/utils/convertToPost';
import * as blogsService from '@/domain/blogs.service';
import * as blogsRepository from '@/repository/blogs.repository';
import { validateObjectId } from '@/customValidators/objectIdValidator';
import { validatePaginationQuery } from '@/customValidators/paginationValidator';

export const getBlogPosts = [
  validateObjectId,
  ...validatePaginationQuery,
  async (req: Request, res: Response) => {
    const { pageNumber, pageSize, sortBy, sortDirection, searchNameTerm } =
      req.query as unknown as PaginationQuery;

    const id = req.params.id;

    const posts = await blogsService.findBlogPosts(id, {
      pageNumber,
      pageSize,
      sortBy,
      sortDirection,
      searchNameTerm,
    });

    if (posts === null) return res.sendStatus(404);

    const totalCount = (await blogsRepository.getBlogPostsCount(id)) as number;

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
