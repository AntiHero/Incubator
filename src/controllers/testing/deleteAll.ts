import { Request, Response } from 'express';

import * as blogsRepository from '../../repository/blogs.repository';

export const deleteAll = [
  async (_: Request, res: Response) => {
    await blogsRepository.deleteAll(); 

    res.status(204).end();
  },
];
