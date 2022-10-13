import Comment from '@/models/Comment';
import { h06, PaginationQuery } from '@/@types';
import * as commentsRepository from '@/repository/comments.repository';

export const addComment = async (
  content: h06.CommentInputModel['content'],
  userId: string,
  userLogin: string,
  postId?: string
): Promise<h06.CommentViewModel | null> => {
  const doc = await commentsRepository.saveComment(
    new Comment({ content, userId, userLogin }),
    postId
  );

  return doc;
};

export const findCommentsByQuery = async (
  query: PaginationQuery & { postId: string }
) => {
  return commentsRepository.findCommentsByQuery(query);
};

export const getCommentsCount = async (postId: string) => {
  return commentsRepository.getCommentsCount(postId);
};

export const getComment = async (commentId: string) => {
  return commentsRepository.findCommentById(commentId);
}

export const deleteComment = async (commentId: string) => {
  return commentsRepository.findCommentByIdAndDelete(commentId);
}

export const updateComment = async (id: string, { content } : h06.CommentInputModel) => {
  return await commentsRepository.updateCommentById(id, { content });
}