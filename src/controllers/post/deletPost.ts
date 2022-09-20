import { Request, Response } from 'express';

import * as postsRepository from '../../repository/posts.repository';
import { checkAuthorization } from '../../customValidators/checkAuthorization';

export const deletePost = [
  ...checkAuthorization,
  async (req: Request, res: Response) => {
    const result = postsRepository.findPostByIdAndDelete(req.params.id);

    if (result === null) {
      res.status(404).end();

      return;
    }

    res.status(204).end();
  },
];

