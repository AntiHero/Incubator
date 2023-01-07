import { PostDTO, PostViewModel } from '../types';

export const convertToPostViewModel = (post: PostDTO): PostViewModel => {
  const view = { ...post, blogName: post.blogName };

  delete view.comments;

  delete view.likes;

  return view;
};
