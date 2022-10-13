import { Request, Response } from 'express';
import { checkAuthorization } from '@/customValidators/basicAuthValidator';
import * as commentsService from '@/domain/comments.service';

export const deleteComment = [
  ...checkAuthorization,
  async (req: Request, res: Response) => {
    const userId = req.userId;
    const commentId = req.params.id;

    const comment = await commentsService.getComment(commentId);

    if (!comment) return res.sendStatus(404);

    if (comment.userId !== userId) {
      res.sendStatus(403);

      return;
    }

    res.sendStatus(204);
  },
];
