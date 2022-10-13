import { Request, Response } from 'express';

import { PaginationQuery } from '@/@types';
import Paginator from '@/models/Paginator';
import { convertToComment } from '@/utils/convertToComment';
import * as commentsService from '@/domain/comments.service';
import * as postRepository from '@/repository/posts.repository';
import { validatePaginationQuery } from '@/customValidators/paginationValidator';

export const getComments = [
  validatePaginationQuery,
  async (req: Request, res: Response) => {
    const postId = req.params.id;
    const post = postRepository.findPostById(postId);

    if (!post) return res.sendStatus(404);

    const { pageNumber, pageSize, sortBy, sortDirection } =
      req.query as unknown as PaginationQuery;

    const comments = await commentsService.findCommentsByQuery({
      pageNumber,
      pageSize,
      sortBy,
      sortDirection,
      postId,
    });

    const totalCount = await commentsService.getCommentsCount(postId);

    const items = comments.map(convertToComment);

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
