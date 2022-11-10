import { PostDTO, PostViewModel } from '../types';

export const convertToPostViewModel = (post: PostDTO): PostViewModel => {
  const view = { ...post };

  delete view.comments;

  return view;
};
