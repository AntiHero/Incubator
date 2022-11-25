import { BlogDTO, BlogViewModel } from '../types';

export const convertToBlogViewModel = (blog: BlogDTO): BlogViewModel => {
  const view = { ...blog };

  delete view.posts;

  delete view.userId;

  return view;
};
