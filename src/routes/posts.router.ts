import { Router } from 'express';

import { getPost } from '@/controllers/post/getPost';
import { postPost } from '@/controllers/post/postPost';
import { deletePost } from '@/controllers/post/deletePost';
import { updatePost } from '@/controllers/post/updatePost';
import { getAllPosts } from '@/controllers/post/getAllPosts';
import { postComment } from '@/controllers/post/postComment';
import { getComments } from '@/controllers/post/getPostComments';

const postsRouters = Router();

postsRouters.get('/', getAllPosts);

postsRouters.post('/', postPost);

postsRouters.post('/:id/comments', postComment);

postsRouters.get('/:id/comments', getComments);

postsRouters.get('/:id', getPost);

postsRouters.put('/:id', updatePost);

postsRouters.delete('/:id', deletePost);

export default postsRouters;
