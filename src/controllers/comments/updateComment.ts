import { body } from 'express-validator';
import { Request, Response } from 'express';

import { CommentFields } from '@/enums';
import { APIErrorResult } from '@/@types';
import * as ErrorMessages from '@/errorMessages';
import * as commentsService from '@/domain/comments.service';
import { customValidationResult } from '@/customValidators/customValidationResults';
import { checkAuthorization as checkBearerAuth } from '@/customValidators/bearerAuthValidator';

const MIN_LENGTH = 20;
const MAX_LENGTH = 300;

export const updateComment = [
  ...checkBearerAuth,
  body(CommentFields.content)
    .isString()
    .withMessage(ErrorMessages.NOT_STRING_ERROR)
    .trim()
    .isLength({ max: MAX_LENGTH })
    .withMessage(ErrorMessages.MAX_LENGTH_ERROR(MAX_LENGTH))
    .isLength({ min: MIN_LENGTH })
    .withMessage(ErrorMessages.MIN_LENGTH_ERROR(MIN_LENGTH)),
  async (req: Request, res: Response) => {
    const userId = req.userId;
    const commentId = req.params.id;

    const comment = await commentsService.getComment(commentId);

    if (!comment) return res.sendStatus(404);

    if (comment.userId !== userId) {
      res.sendStatus(403);

      return;
    }

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

    await commentsService.updateComment(commentId, {
      content: req.body.content,
    });

    res.sendStatus(204)
  },
];
