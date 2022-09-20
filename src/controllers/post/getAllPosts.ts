import { Request, Response } from 'express';

import * as postsRepository from '../../repository/posts.repository';

export const getAllPosts = async (_: Request, res: Response) => {
  const blogs = await postsRepository.getAllPosts();

  res
    .type('text/plain')
    .status(200)
    .send(JSON.stringify(blogs));
};
