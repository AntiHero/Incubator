import { Request, Response } from 'express';

import * as commentsService from '@/domain/comments.service';
import { validateObjectId } from '@/customValidators/objectIdValidator';

export const getComment = [
  validateObjectId,
  async (req: Request, res: Response) => {
    const commentId = req.params.id;

    const comment = await commentsService.getComment(commentId);

    if (!comment) return res.sendStatus(404);

    res
      .status(200)
      .set('Content-Type', 'text/plain')
      .json(comment);
  },
];
