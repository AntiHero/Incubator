import { Request, Response } from 'express';
import * as blogsRepository from '../repository/blogs.repository';

export const getAllBlogs = async (_: Request, res: Response) => {
  const blogs = await blogsRepository.getAllBlogs();

  res
    .type('text/plain')
    .status(200)
    .send(JSON.stringify(blogs));
};
