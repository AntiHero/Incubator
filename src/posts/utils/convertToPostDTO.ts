import { LeanDocument, Types } from 'mongoose';

import { PostDTO } from '../types';
import { PostModel } from '../schemas/post.schema';
import { convertToLikeDTO } from 'root/likes/utils/convertToLikeDTO';
import { convertToCommentDTO } from 'root/comments/utils/convertToCommentDTO';
import { CommentDTO } from 'root/comments/types';
import { LikeDTO } from 'root/likes/types';

export const convertToPostDTO = <
  T extends LeanDocument<PostModel & { _id: Types.ObjectId }>,
>(
  doc: T,
): PostDTO => {
  let comments: CommentDTO[] = [];

  if (!doc.comments.some((comment) => comment instanceof Types.ObjectId)) {
    comments = doc.comments.map(convertToCommentDTO);
  }

  let likes: LikeDTO[] = [];

  if (!doc.likes.some((like) => like instanceof Types.ObjectId)) {
    likes = doc.likes.map(convertToLikeDTO);
  }

  return {
    id: String(doc._id),
    content: doc.content,
    shortDescription: doc.shortDescription,
    title: doc.title,
    blogId: String(doc.blogId),
    blogName: doc.blogName,
    comments,
    likes,
    createdAt: doc.createdAt.toISOString(),
  };
};
