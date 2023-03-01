import { BlogDTO, BlogViewModel } from '../types';

export const convertToBlogViewModel = (blog: BlogDTO): BlogViewModel => {
  const { id, name, websiteUrl, description, createdAt, isMembership } = blog;

  const result: BlogViewModel = {
    id,
    name,
    websiteUrl,
    description,
    createdAt,
    isMembership,
  };

  blog.images && (result.images = blog.images);

  return result;
};
