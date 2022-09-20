import { Request, Response } from 'express';

import * as blogsRepository from '../../repository/blogs.repository';
import { checkAuthorization } from '../../customValidators/checkAuthorization';

export const deleteBlog = [
  ...checkAuthorization,
  async (req: Request, res: Response) => {
    const result = blogsRepository.findBlogByIndAndDelete(req.params.id);

    if (result === null) {
      res.status(404).end();

      return;
    }

    res.status(204).end();
  },
];
