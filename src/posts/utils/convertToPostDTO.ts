import { PostDTO, PostLeanModel } from '../types';
import { convertToCommentDTO } from 'root/comments/utils/convertToCommentDTO';

export const convertToPostDTO = <T extends PostLeanModel>(
  doc: T,
  populate = false,
): PostDTO => ({
  id: String(doc._id),
  content: doc.content,
  shortDescription: doc.shortDescription,
  title: doc.title,
  blogId: String(doc.blogId),
  blogName: doc.blogName,
  comments: populate
    ? doc.comments.map((comment) => convertToCommentDTO(comment, true))
    : [],
  createdAt: doc.createdAt.toISOString(),
});
