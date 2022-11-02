import { Request, Response } from 'express';

import * as commentsService from '@/app/comments.service';
import { checkJWTAuth } from '@/middlewares/userAuthWithToken';
import { validateObjectId } from '@/customValidators/objectIdValidator';
import { convertToCommentViewModel } from '@/utils/convertToCommentView';

export const getComment = [
  validateObjectId,
  checkJWTAuth,
  async (req: Request, res: Response) => {
    const commentId = req.params.id;

    const comment = await commentsService.getComment(commentId);

    if (!comment) return res.sendStatus(404);

    const userId = req.userId;

    if (userId) {
      const userLikeStatus = await commentsService.getUserCommentLikeStatus(
        comment.userId,
        commentId
      );

      const resultComment = {
        ...comment,
        likesInfo: {
          ...comment.likesInfo,
          myStatus: userLikeStatus ?? comment.likesInfo.myStatus,
        },
      };

      res
        .status(200)
        .type('text/plain')
        .json(convertToCommentViewModel(resultComment));
    }

    res.status(200).type('text/plain').json(convertToCommentViewModel(comment));
  },
];
