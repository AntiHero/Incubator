import Comment from '@/models/Comment';
import { CommentModel } from '@/adapters/mongoose/commentsModel';
import * as commentsRepository from '@/repository/comments.repository';
import { CommentsMongooseAdapter } from '@/adapters/mongoose/commentsAdapter';
import { CommentModelType, h06, LikeStatus, PaginationQuery } from '@/@types';
import { UserCommentLikeModel } from '@/adapters/mongoose/userCommentLikeModel';
import { UserCommentLikeMongooseAdapter } from '@/adapters/mongoose/userCommentLikeAdapter';

const commentsAdapter = new CommentsMongooseAdapter(CommentModel);
const userCommentsLikeAdapter = new UserCommentLikeMongooseAdapter(
  UserCommentLikeModel
);

export const addComment = async (
  content: h06.CommentInputModel['content'],
  userId: string,
  userLogin: string,
  postId?: string
): Promise<(CommentModelType & { id: string }) | null> => {
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
): Promise<(CommentModelType & { id: string})[]> => {
  const comments = await commentsAdapter.findCommentsByQuery(query);

  return comments;
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

export const updateCommentLikeStatus = async (
  userId: string,
  commentId: string,
  likeStatus: LikeStatus
) => {
  const comment = await commentsAdapter.findCommentById(commentId);

  if (!comment) return null;

  const userCommentLike = await userCommentsLikeAdapter.getUserCommentLike(
    userId,
    commentId
  );

  if (userCommentLike && userCommentLike.likeStatus === likeStatus) return null;

  if (!userCommentLike) {
    if (likeStatus === LikeStatus.None) return null;

    if (likeStatus === LikeStatus.Like) {
      await commentsAdapter.findCommentByIdAndUpdate(commentId, {
        likesInfo: {
          likesCount: comment.likesInfo.likesCount + 1,
          dislikesCount: comment.likesInfo.dislikesCount,
          myStatus: LikeStatus.None,
        },
      });

      await userCommentsLikeAdapter.createUserCommentLike({
        userId: comment.userId,
        commentId: comment.id,
        likeStatus: LikeStatus.Like,
      });
    }

    if (likeStatus === LikeStatus.Dislike) {
      await commentsAdapter.findCommentByIdAndUpdate(commentId, {
        likesInfo: {
          likesCount: comment.likesInfo.likesCount,
          dislikesCount: comment.likesInfo.dislikesCount + 1,
          myStatus: LikeStatus.None,
        },
      });

      await userCommentsLikeAdapter.createUserCommentLike({
        userId: comment.userId,
        commentId: comment.id,
        likeStatus: LikeStatus.Dislike,
      });
    }

    return true;
  }

  if (likeStatus === LikeStatus.None) {
    if (userCommentLike.likeStatus === LikeStatus.Dislike) {
      await commentsAdapter.findCommentByIdAndUpdate(commentId, {
        likesInfo: {
          likesCount: comment.likesInfo.likesCount,
          dislikesCount: comment.likesInfo.dislikesCount - 1,
          myStatus: LikeStatus.None,
        },
      });
    }

    if (userCommentLike.likeStatus === LikeStatus.Like) {
      await commentsAdapter.findCommentByIdAndUpdate(commentId, {
        likesInfo: {
          likesCount: comment.likesInfo.likesCount - 1,
          dislikesCount: comment.likesInfo.dislikesCount,
          myStatus: LikeStatus.None,
        },
      });
    }

    await userCommentsLikeAdapter.deleteUserCommentLikeById(userCommentLike.id);

    return true;
  }

  if (likeStatus === LikeStatus.Like) {
    if (userCommentLike.likeStatus === LikeStatus.None) {
      await commentsAdapter.findCommentByIdAndUpdate(commentId, {
        likesInfo: {
          likesCount: comment.likesInfo.likesCount + 1,
          dislikesCount: comment.likesInfo.dislikesCount,
          myStatus: LikeStatus.None,
        },
      });
    }

    if (userCommentLike.likeStatus === LikeStatus.Dislike) {
      await commentsAdapter.findCommentByIdAndUpdate(commentId, {
        likesInfo: {
          likesCount: comment.likesInfo.likesCount + 1,
          dislikesCount: comment.likesInfo.dislikesCount - 1,
          myStatus: LikeStatus.None,
        },
      });
    }

    await userCommentsLikeAdapter.updateUserCommentLike(userCommentLike.id, {
      userId: comment.userId,
      commentId: comment.id,
      likeStatus: LikeStatus.Like,
    });

    return true;
  }

  if (likeStatus === LikeStatus.Dislike) {
    if (userCommentLike.likeStatus === LikeStatus.None) {
      await commentsAdapter.findCommentByIdAndUpdate(commentId, {
        likesInfo: {
          likesCount: comment.likesInfo.likesCount,
          dislikesCount: comment.likesInfo.dislikesCount + 1,
          myStatus: LikeStatus.None,
        },
      });
    }

    if (userCommentLike.likeStatus === LikeStatus.Like) {
      await commentsAdapter.findCommentByIdAndUpdate(commentId, {
        likesInfo: {
          likesCount: comment.likesInfo.likesCount - 1,
          dislikesCount: comment.likesInfo.dislikesCount + 1,
          myStatus: LikeStatus.None,
        },
      });
    }

    await userCommentsLikeAdapter.updateUserCommentLike(userCommentLike.id, {
      userId: comment.userId,
      commentId: comment.id,
      likeStatus: LikeStatus.Dislike,
    });

    return true;
  }

  return null;
};

export const getUserCommentLikeStatus = async (
  userId: string,
  commentId: string
) => {
  return userCommentsLikeAdapter.getUserCommentLikeStatus(userId, commentId);
};
