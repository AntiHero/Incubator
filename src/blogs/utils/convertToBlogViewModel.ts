import { BlogDTO, BlogViewModel } from '../types';

export const convertToBlogViewModel = (blog: BlogDTO): BlogViewModel => {
  const { id, name, websiteUrl, description, createdAt } = blog;

  return { id, name, websiteUrl, description, createdAt };
};
