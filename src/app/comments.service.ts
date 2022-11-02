import Comment from '@/models/Comment';
import { CommentModel } from '@/adapters/mongoose/commentsModel';
import { CommentModelType, h06, PaginationQuery } from '@/@types';
import * as commentsRepository from '@/repository/comments.repository';
import { CommentsMongooseAdapter } from '@/adapters/mongoose/commentsAdapter';

const commentsAdapter = new CommentsMongooseAdapter(CommentModel);

export const addComment = async (
  content: h06.CommentInputModel['content'],
  userId: string,
  userLogin: string,
  postId?: string
): Promise<CommentModelType | null> => {
  try {
    const doc = await commentsAdapter.saveComment(
      new Comment({ content, userId, userLogin }),
      postId
    );

    return doc;
  } catch (e) {
    return null;
  }
};

export const findCommentsByQuery = async (
  query: PaginationQuery & { postId: string }
) => {
  return commentsAdapter.findCommentsByQuery(query);
};

export const getCommentsCount = async (postId: string) => {
  return commentsAdapter.getCommentsCount(postId);
};

export const getComment = async (commentId: string) => {
  return commentsAdapter.findCommentById(commentId);
};

export const deleteComment = async (commentId: string) => {
  return commentsAdapter.findCommentByIdAndDelete(commentId);
};

export const updateComment = async (
  id: string,
  { content }: h06.CommentInputModel
) => {
  return await commentsRepository.updateCommentById(id, { content });
};
