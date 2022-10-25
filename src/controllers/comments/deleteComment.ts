import { Request, Response } from 'express';
import * as commentsService from '@/app/comments.service';
import { validateObjectId } from '@/customValidators/objectIdValidator';
import { checkAuthorization } from '@/customValidators/bearerAuthValidator';

export const deleteComment = [
  ...checkAuthorization,
  validateObjectId,
  async (req: Request, res: Response) => {
    const userId = req.userId;
    const commentId = req.params.id;

    const comment = await commentsService.getComment(commentId);

    if (!comment) return res.sendStatus(404);

    if (comment.userId !== userId) {
      res.sendStatus(403);

      return;
    }

    await commentsService.deleteComment(commentId);

    res.sendStatus(204);
  },
];
