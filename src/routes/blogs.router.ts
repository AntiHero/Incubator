import { Router } from 'express';

import { getBlog } from '@/controllers/blog/getBlog';
import { postBlog } from '@/controllers/blog/postBlog';
import { updateBlog } from '@/controllers/blog/updateBlog';
import { deleteBlog } from '@/controllers/blog/deleteBlog';
import { getAllBlogs } from '@/controllers/blog/getAllBlogs';
import { getBlogPosts } from '@/controllers/blog/getBlogPosts';

const blogsRouter = Router();

blogsRouter.get('/', getAllBlogs);

blogsRouter.post('/', postBlog);

blogsRouter.get('/:id', getBlog);

blogsRouter.get('/:id/posts', getBlogPosts);

blogsRouter.post('/:id/posts', () => { /*TODO */});

blogsRouter.put('/:id', updateBlog);

blogsRouter.delete('/:id', deleteBlog);

export default blogsRouter;
