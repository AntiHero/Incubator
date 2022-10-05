import { Post, h04 } from '@/@types';

export const convertToPost = <T extends Post>(doc: T): h04.PostViewModel => ({
  id: String(doc._id),
  title: doc.title,
  shortDescription: doc.shortDescription,
  content: doc.content,
  blogId: String(doc.blogId),
  blogName: doc.blogName,
  createdAt: doc.createdAt.toISOString(),
});
