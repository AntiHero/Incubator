import { body } from 'express-validator';
import { Request, Response } from 'express';

import { LikeStatusFields } from '@/enums';
import { APIErrorResult, LikeStatus } from '@/@types';
import * as commentsService from '@/app/comments.service';
import { validateObjectId } from '@/customValidators/objectIdValidator';
import { customValidationResult } from '@/customValidators/customValidationResults';
import { checkAuthorization as bearerAuth } from '@/customValidators/bearerAuthValidator';

export const updateCommentsLikeStatus = [
  validateObjectId,
  ...bearerAuth,
  body(LikeStatusFields.likeStatus)
    .isIn([...Object.values(LikeStatus)])
    .withMessage('Not valid like status'),
  async (req: Request, res: Response) => {
    if (!customValidationResult(req).isEmpty()) {
      res
        .type('text/plain')
        .status(400)
        .send(
          JSON.stringify({
            errorsMessages: customValidationResult(req).array({
              onlyFirstError: true,
            }),
          } as APIErrorResult)
        );

      return;
    }

    const commentId = req.params.id;

    const comment = await commentsService.getComment(commentId);

    if (!comment) return res.sendStatus(404);

    // TODO update like status

    res.sendStatus(204);
  },
];
