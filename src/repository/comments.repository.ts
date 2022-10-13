import { ObjectId } from 'mongodb';

import CommentModel from '@/models/Comment';
import { commentsCollection } from '@/clients';
import { h06, Comment, PaginationQuery } from '@/@types';
import { convertToComment } from '@/utils/convertToComment';
import { countSkip } from '@/utils/countSkip';

export const getAllComments = async () => {
  const cursor = commentsCollection.find<Comment>({});

  const comments: h06.CommentViewModel[] = [];

  await cursor.forEach((doc) => {
    const comment = convertToComment(doc);
    comments.push(comment);
  });

  return comments;
};

export const findCommentById = async (id: string | ObjectId) => {
  const doc = await commentsCollection.findOne<Comment>({
    _id: typeof id === 'string' ? new ObjectId(id) : id,
  });

  if (!doc) return null;

  return convertToComment(doc);
};

export const saveComment = async (comment: CommentModel, postId?: string) => {
  const { insertedId } = await commentsCollection.insertOne({
    ...comment,
    userId: new ObjectId(comment.userId),
    postId: new Object(postId),
    createdAt: new Date(),
  });

  return findCommentById(insertedId);
};

export const getCommentsCount = async (postId: string) => {
  const cursor = await commentsCollection
    .aggregate<{ totalCount: number }>([
      {
        $match: { postId: new Object(postId) },
      },
      {
        $count: 'totalCount',
      },
    ])
    .toArray();

  return cursor.length ? cursor[0].totalCount : 0;
};

export const findCommentsByQuery = async (
  query: PaginationQuery & { postId: string }
) => {
  const posts = await commentsCollection
    .aggregate<Comment>([
      {
        $match: { postId: new Object(query.postId) },
      },
      {
        $sort: { [query.sortBy]: query.sortDirection },
      },
      {
        $skip: countSkip(query.pageSize, query.pageNumber),
      },
      {
        $limit: query.pageSize,
      },
    ])
    .toArray();

  return posts;
};

export const findCommentByIdAndDelete = async (id: string) => {
  const result = await commentsCollection.deleteOne({ _id: new ObjectId(id) });

  if (result.deletedCount === 1) return true;

  return null;
};

export const updateCommentById = async (
  id: string,
  { content }: h06.CommentInputModel
) => {
  const query = { _id: new ObjectId(id) };
  const update = { $set: { content } };

  const result = await commentsCollection.updateOne(query, update);

  if (result.modifiedCount === 1) return true;

  return null;
};
