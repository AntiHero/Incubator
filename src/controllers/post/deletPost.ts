import { Request, Response } from 'express';

import * as postsRepository from '@/repository/posts.repository';
import { validateObjectId } from '@/customValidators/objectIdValidator';
import { checkAuthorization } from '@/customValidators/basicAuthValidator';

export const deletePost = [
  ...checkAuthorization,
  validateObjectId,
  async (req: Request, res: Response) => {
    const result = await postsRepository.findPostByIdAndDelete(req.params.id);

    if (result === null) {
      res.status(404).end();

      return;
    }

    res.status(204).end();
  },
];
