import { Post } from '@/@types';
import * as postsRepository from '@/repository/posts.repository';

export const findBlogPosts = async <T extends Record<string, any>>(
  query: T
): Promise<Post[] | null> => {
  const doc = await postsRepository.findPostsByQuery(query);

  if (!doc) return null;

  return doc;
};
