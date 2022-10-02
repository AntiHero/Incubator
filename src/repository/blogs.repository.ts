import { ObjectId } from 'mongodb';

import { h02, Blog } from '@/@types';
import { convertToBlog } from '@/utils/convertToBlog';
import { blogsCollection, postsCollection } from './collections';

export const getAllBlogs = async () => {
  const cursor = blogsCollection.find<Blog>({});

  const blogs: h02.db.BlogViewModel[] = [];

  await cursor.forEach(doc => {
    const blog = convertToBlog(doc);
    blogs.push(blog);
  });

  return blogs;
};

// export const getAllBlogs = async (): Promise<h02.db.BlogViewModel[]> => {
//   return Promise.resolve().then(() => data.blogs);
// };

export const saveBlog = async (blog: h02.db.BlogInputModel) => {
  await blogsCollection.insertOne({ ...blog, createdAt: new Date() });

  return true;
};

// export const saveBlog = async (blog: h02.db.BlogViewModel) => {
//   return Promise.resolve().then(() => data.blogs.push(blog));
// };

export const findBlogById = async (id: string) => {
  const doc = await blogsCollection.findOne<Blog>(
    { _id: new ObjectId(id) }
    //{projection: { _id: 0, createdAt: 0}}
  );
  console.log(doc, 'doc');
  if (!doc) return null;

  return convertToBlog(doc);
};

// export const findBlogById = async (id: string) => {
//   for (const blog of data.blogs) {
//     if (blog.id === id) return Promise.resolve().then(() => blog);
//   }

//   return null;
// };

export const findBlogByIdAndUpdate = async (
  id: string,
  { name, youtubeUrl }: h02.db.BlogInputModel
) => {
  const query = { _id: new ObjectId(id) };
  const update = { $set: { name, youtubeUrl } };

  const result = await blogsCollection.updateOne(query, update);

  if (result.modifiedCount === 1) return true;

  return null;
};

// export const findBlogByIdAndUpdate = async (
//   id: string,
//   { name, youtubeUrl }: h02.db.BlogInputModel
// ) => {
//   for (const blog of data.blogs) {
//     if (blog.id === id)
//       return Promise.resolve().then(() => {
//         blog.name = name;
//         blog.youtubeUrl = youtubeUrl;
//       });
//   }

//   return null;
// };

export const findBlogByIdAndDelete = async (id: string) => {
  const result = await blogsCollection.deleteOne({ _id: new ObjectId(id) });

  if (result.deletedCount === 1) return true;

  return null;
};

// export const findBlogByIdAndDelete = async (id: string) => {
//   for (const [index, blog] of Object.entries(data.blogs)) {
//     if (blog.id === id) {
//       data.blogs.splice(Number(index), 1);

//       return true;
//     }
//   }

//   return null;
// };

// export const deleteAll = async () => {
//   try {
//     await Promise.resolve().then(() => data.blogs.splice(0));
//     await Promise.resolve().then(() => data.posts.splice(0));
//   } catch (e) {
//     return null;
//   }

//   return true;
// };

export const deleteAll = async () => {
  await blogsCollection.deleteMany({});
  await postsCollection.deleteMany({});
};
