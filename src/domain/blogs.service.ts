import { PaginationQuery, Post } from '@/@types';
import * as blogsRepository from '@/repository/blogs.repository';

export const findBlogPosts = async (
  id: string,
  query: PaginationQuery
): Promise<Post[] | null> => {
  const doc = await blogsRepository.findBlogPostsByQuery(id, query);

  if (!doc) return null;

  return doc;
};
