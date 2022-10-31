import { Request, Response } from 'express';

import * as usersService from '@/app/users.service';
import * as blogsRepository from '@/repository/blogs.repository';
import * as postsRepository from '@/repository/posts.repository';
// import * as usersRepository from '@/repository/users.repository';
import securityDeviceRepository from '@/repository/security.repository';
import * as refreshTokenBlkLstRepository from '@/repository/tokensBlackList.repository';

export const deleteAll = async (_: Request, res: Response) => {
  await usersService.deleteAll();
  await blogsRepository.deleteAll();
  await postsRepository.deleteAll();
  // await usersRepository.deleteAll();
  await securityDeviceRepository.deleteAll();
  await refreshTokenBlkLstRepository.deleteAll();

  res.status(204).end();
};
