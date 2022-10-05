import { ObjectId } from 'mongodb';

import { h04, Blog } from '@/@types';
import { convertToBlog } from '@/utils/convertToBlog';
import { blogsCollection, postsCollection } from './collections';

export const getAllBlogs = async () => {
  const cursor = blogsCollection.find<Blog>({});

  const blogs: h04.BlogViewModel[] = [];

  await cursor.forEach(doc => {
    const blog = convertToBlog(doc);
    blogs.push(blog);
  });

  return blogs;
};

export const saveBlog = async (blog: h04.BlogInputModel) => {
  const { insertedId } = await blogsCollection.insertOne({
    ...blog,
    createdAt: new Date(),
  });

  return findBlogById(insertedId);
};

export const findBlogById = async (id: string | ObjectId) => {
  const doc = await blogsCollection.findOne<Blog>({
    _id: typeof id === 'string' ? new ObjectId(id) : id,
  });

  if (!doc) return null;

  return convertToBlog(doc);
};

export const findBlogByIdAndUpdate = async (
  id: string,
  { name, youtubeUrl }: h04.BlogInputModel
) => {
  const query = { _id: new ObjectId(id) };
  const update = { $set: { name, youtubeUrl } };

  const result = await blogsCollection.updateOne(query, update);

  if (result.modifiedCount === 1) return true;

  return null;
};

export const findBlogByIdAndDelete = async (id: string) => {
  const result = await blogsCollection.deleteOne({ _id: new ObjectId(id) });

  if (result.deletedCount === 1) return true;

  return null;
};

export const deleteAll = async () => {
  await blogsCollection.deleteMany({});
  await postsCollection.deleteMany({});
};
