import { Router } from 'express';
import { getAllBlogs } from '../controllers/getAllBlogs';
import { postBlog } from '../controllers/postBlog';

const blogsRouter = Router();

blogsRouter.get('/', getAllBlogs);

blogsRouter.post('/', postBlog);

blogsRouter.get('/:id' /*TODO*/);

blogsRouter.put('/:id' /*TODO*/);

blogsRouter.delete('/:id' /*TODO*/);

export default blogsRouter;
