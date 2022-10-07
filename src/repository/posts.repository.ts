import { ObjectId } from 'mongodb';

import { h04, Post } from '@/@types';
import { convertToPost } from '@/utils/convertToPost';
import { blogsCollection, postsCollection } from './collections';

export const getAllPosts = async () => {
  const cursor = postsCollection.find<Post>({});

  const posts: h04.PostInputModel[] = [];

  await cursor.forEach(doc => {
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
