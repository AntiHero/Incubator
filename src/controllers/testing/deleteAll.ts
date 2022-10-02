import { Request, Response } from 'express';

import * as blogsRepository from '@/repository/blogs.repository';
import * as postsRepository from '@/repository/posts.repository';

export const deleteAll = async (_: Request, res: Response) => {
  await blogsRepository.deleteAll();
  await postsRepository.deleteAll();

  res.status(204).end();
};
