import { BlogDTO } from 'root/blogs/types';
import { BlogSaViewModel } from '../types';

export const convertToBlogViewModel = (blog: BlogDTO): BlogSaViewModel => {
  const { id, name, websiteUrl, description, createdAt, banInfo } = blog;

  return { id, name, websiteUrl, description, createdAt, banInfo };
};
