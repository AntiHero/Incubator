import { BlogDTO, BlogLeanModel } from '../types';
import { convertToPostDTO } from 'root/posts/utils/convertToPostDTO';

export const convertToBlogDTO = <T extends BlogLeanModel>(
  doc: T,
  populate = false,
): BlogDTO => ({
  id: String(doc._id),
  name: doc.name,
  youtubeUrl: doc.youtubeUrl,
  posts: populate ? doc.posts.map((post) => convertToPostDTO(post, false)) : [],
  createdAt: doc.createdAt.toISOString(),
});
