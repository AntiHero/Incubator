import { Request, Response } from 'express';

import Paginator from '@/models/Paginator';
import { PaginationQuery } from '@/@types';
import { convertToBlog } from '@/utils/convertToBlog';
import * as blogsRepository from '@/repository/blogs.repository';
import { validatePaginationQuery } from '@/customValidators/paginationValidator';

export const getAllBlogs = [...validatePaginationQuery, async (req: Request, res: Response) => {
    const {
      pageNumber,
      pageSize,
      sortBy,
      sortDirection,
    } = (req.query as unknown) as PaginationQuery;

  const blogs = await blogsRepository.findBlogsByQuery({pageNumber, pageSize, sortBy, sortDirection});
  const totalCount = await blogsRepository.getBlogsCount();
  const items = blogs.map(convertToBlog);
  const result = new Paginator(Math.ceil(totalCount / pageSize), pageNumber, pageSize, totalCount, items);

  res.type('text/plain').status(200).send(JSON.stringify(result));
}];
