import { BlogDTO } from '../types';

import { LeanDocument, Types } from 'mongoose';

import { BlogModel } from '../schemas/blogs.schema';
import { convertToPostDTO } from 'root/posts/utils/convertToPostDTO';
import { PostDTO } from 'root/posts/types';

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
    youtubeUrl: doc.youtubeUrl,
    posts,
    createdAt: doc.createdAt.toISOString(),
  };
};
