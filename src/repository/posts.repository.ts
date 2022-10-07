import { ObjectId } from 'mongodb';

import { countSkip } from '@/utils/countSkip';
import { convertToPost } from '@/utils/convertToPost';
import { h04, PaginationQuery, Post } from '@/@types';
import { blogsCollection, postsCollection } from './collections';

export const getAllPosts = async () => {
  const cursor = postsCollection.find<Post>({});

  const posts: h04.PostInputModel[] = [];

  await cursor.forEach((doc) => {
    const post = convertToPost(doc);
    posts.push(post);
  });

  return posts;
};

export const savePost = async (post: h04.PostInputModel) => {
  const blogId = post.blogId;

  const blog = await blogsCollection.findOne({
    _id: new ObjectId(blogId),
  });

  if (!blog) return null;

  const { insertedId } = await postsCollection.insertOne({
    ...post,
    blogId: new ObjectId(blogId),
    createdAt: new Date(),
  });

  return findPostById(insertedId);
};

export const findPostById = async (id: string | ObjectId) => {
  const doc = await postsCollection.findOne<Post>({
    _id: typeof id === 'string' ? new ObjectId(id) : id,
  });

  if (!doc) return null;

  return convertToPost(doc);
};

export const findPostByIdAndUpdate = async (
  id: string,
  { content, title, shortDescription, blogId }: h04.PostInputModel
) => {
  const query = { _id: new ObjectId(id) };
  const blog = blogsCollection.findOne(query);

  if (!blog) return null;

  const update = { $set: { content, title, shortDescription, blogId } };
  const result = await postsCollection.updateOne(query, update);

  if (result.modifiedCount === 1) return true;

  return null;
};

export const findPostByIdAndDelete = async (id: string) => {
  const result = await postsCollection.deleteOne({ _id: new ObjectId(id) });

  if (result.deletedCount === 1) return true;

  return null;
};

export const deleteAll = async () => {
  await postsCollection.deleteMany({});
};

export const getPostsCount = async () => {
  const cursor = await postsCollection
    .aggregate<{ totalCount: number }>([
      {
        $match: {},
      },
      {
        $count: 'totalCount',
      },
    ])
    .toArray();

  return cursor.length ? cursor[0].totalCount : 0;
};

export const findPostsByQuery = async (query: PaginationQuery) => {
  const posts = await postsCollection
    .aggregate<Post>([
      {
        $match: {},
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
