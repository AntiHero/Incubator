import { BlogDTO } from '../types';

import { LeanDocument, Types } from 'mongoose';

import { PostDTO } from 'root/posts/types';
import { BlogModel } from '../schemas/blogs.schema';
import { convertToPostDTO } from 'root/posts/utils/convertToPostDTO';

export const convertToBlogDTO = <
  T extends LeanDocument<BlogModel & { _id: Types.ObjectId }>,
>(
  doc: T,
): BlogDTO => {
  let posts: PostDTO[] = [];

  if (!doc.posts.some((post) => post instanceof Types.ObjectId)) {
    posts = doc.posts.map(convertToPostDTO);
  }

  return {
    id: String(doc._id),
    name: doc.name,
    websiteUrl: doc.websiteUrl,
    description: doc.description,
    posts,
    userId: String(doc.userId),
    createdAt: doc.createdAt.toISOString(),
  };
};
