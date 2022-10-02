import { Router } from 'express';

import { getPost } from '@/controllers/post/getPost';
import { postPost } from '@/controllers/post/postPost';
import { deletePost } from '@/controllers/post/deletPost';
import { updatePost } from '@/controllers/post/updatePost';
import { getAllPosts } from '@/controllers/post/getAllPosts';

const postsRouters = Router();

postsRouters.get('/', getAllPosts);

postsRouters.post('/', postPost);

postsRouters.get('/:id', getPost);

postsRouters.put('/:id', updatePost);

postsRouters.delete('/:id', deletePost);

export default postsRouters;
