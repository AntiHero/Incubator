import { Request, Response } from 'express';

import * as usersService from '@/app/users.service';
import * as blogsRepository from '@/repository/blogs.repository';
import * as postsRepository from '@/repository/posts.repository';
import securityDeviceRepository from '@/repository/security.repository';
import * as refreshTokenBlkLstRepository from '@/repository/tokensBlackList.repository';

export const deleteAll = async (_: Request, res: Response) => {
  await usersService.deleteAll();
  await blogsRepository.deleteAll();
  await postsRepository.deleteAll();
  await securityDeviceRepository.deleteAll();
  await refreshTokenBlkLstRepository.deleteAll();

  res.status(204).end();
};
