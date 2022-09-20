import { Request, Response } from 'express';

import * as postsRepository from '../../repository/posts.repository';

export const getBlog = async (req: Request, res: Response) => {
  const id = req.params.id;

  const blog = await postsRepository.findPostById(id);

  if (blog) {
    res
      .type('text/plain')
      .status(200)
      .send(JSON.stringify(blog));
  } else {
    res.status(404).end();
  }
};
