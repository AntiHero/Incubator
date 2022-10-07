import { Request, Response } from 'express';

import * as blogsRepository from '@/repository/blogs.repository';
import { validateObjectId } from '@/customValidators/objectIdValidator';
import { checkAuthorization } from '@/customValidators/basicAuthValidator';

export const deleteBlog = [
  ...checkAuthorization,
  validateObjectId,
  async (req: Request, res: Response) => {
    const result = await blogsRepository.findBlogByIdAndDelete(req.params.id);

    if (result === null) {
      return res.sendStatus(404);
    }

    res.status(204).end();
  },
];
