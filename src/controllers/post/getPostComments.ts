import { Request, Response } from 'express';

import { LikeStatus, PaginationQuery } from '@/@types';
import Paginator from '@/models/Paginator';
import * as commentsService from '@/app/comments.service';
import * as postRepository from '@/repository/posts.repository';
import { convertToCommentViewModel } from '@/utils/convertToCommentView';
import { validatePaginationQuery } from '@/customValidators/paginationValidator';
import { checkJWTAuth } from '@/middlewares/userAuthWithToken';

export const getComments = [
  ...validatePaginationQuery,
  checkJWTAuth,
  async (req: Request, res: Response) => {
    const postId = req.params.id;
    const post = await postRepository.findPostById(postId);

    if (!post) return res.sendStatus(404);

    const {
      pageNumber,
      pageSize,
      sortBy,
      sortDirection,
    } = (req.query as unknown) as PaginationQuery;

    const comments = await commentsService.findCommentsByQuery({
      pageNumber,
      pageSize,
      sortBy,
      sortDirection,
      postId,
    });

    const totalCount = await commentsService.getCommentsCount(postId);

    for (let i = 0; i < comments.length; i++) {
      const userId = comments[i].userId;
      const commentId = comments[i].id;

      const likeStatus = await commentsService.getUserCommentLikeStatus(
        userId,
        commentId
      );

      comments[i].likesInfo.myStatus = req.userId
        ? likeStatus ?? LikeStatus.None
        : LikeStatus.None;
    }

    const items = comments.map(convertToCommentViewModel);

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
