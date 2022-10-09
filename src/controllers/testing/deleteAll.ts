import { Request, Response } from 'express';

import * as blogsRepository from '@/repository/blogs.repository';
import * as postsRepository from '@/repository/posts.repository';
import * as usersRepository from '@/repository/users.repository';

export const deleteAll = async (_: Request, res: Response) => {
  await blogsRepository.deleteAll();
  await postsRepository.deleteAll();
  await usersRepository.deleteAll();

  res.status(204).end();
};
