import { ObjectId } from 'mongodb';

import { h02, Post } from '@/@types';
import { blogsCollection, postsCollection } from './collections';
import { convertToPost } from '@/utils/convertToPost';

export const getAllPosts = async () => {
  const cursor = postsCollection.find<Post>({});

  const posts: h02.db.PostInputModel[] = [];

  await cursor.forEach((doc) => {
    const post = convertToPost(doc);
    posts.push(post);
  });

  return posts;
};

// export const getAllPosts = async (): Promise<h02.db.PostViewModel[]> => {
//   return Promise.resolve().then(() => data.posts);
// };
export const savePost = async (post: h02.db.PostInputModel) => {
  const blogId = post.blogId;

  const blog = await blogsCollection.findOne({
    _id: new ObjectId(blogId),
  });

  if (!blog) return null;

  await postsCollection.insertOne({
    ...post,
    blogId: new ObjectId(blogId),
    createdAt: new Date(),
  });

  return true;
};

// export const savePost = async (post: h02.db.PostViewModel) => {
//   for (const blog of data.blogs) {
//     if (blog.id === post.blogId) {
//       return Promise.resolve().then(() => data.posts.push(post));
//     }
//   }

//   return null;
// };

export const findPostById = async (id: string) => {
  const doc = await postsCollection.findOne<Post>({ _id: new ObjectId(id) });

  if (!doc) return null;

  return convertToPost(doc);
};

// export const findPostById = async (id: string) => {
//   for (const post of data.posts) {
//     if (post.id === id) return Promise.resolve().then(() => post);
//   }

//   return null;
// };
export const findPostByIdAndUpdate = async (
  id: string,
  { content, title, shortDescription, blogId }: h02.db.PostInputModel
) => {
  const query = { _id: new ObjectId(id) };
  const blog = blogsCollection.findOne(query);

  if (!blog) return null;

  const update = { $set: { content, title, shortDescription, blogId } };
  const result = await postsCollection.updateOne(query, update);

  if (result.modifiedCount === 1) return true;

  return null;
};

// export const findPostByIdAndUpdate = async (
//   id: string,
//   { content, title, shortDescription, blogId }: h02.db.PostInputModel
// ) => {
//   for (const blog of data.blogs) {
//     if (blog.id === blogId) {
//       for (const post of data.posts) {
//         if (post.id === id)
//           return Promise.resolve().then(() => {
//             post.content = content;
//             post.title = title;
//             post.shortDescription = shortDescription;
//             post.blogId = blogId;
//           });
//       }
//     }
//   }

//   return null;
// };
export const findPostByIdAndDelete = async (id: string) => {
  const result = await postsCollection.deleteOne({ _id: new ObjectId(id) });

  if (result.deletedCount === 1) return true;

  return null;
};
// export const findPostByIdAndDelete = async (id: string) => {
//   for (const [index, post] of Object.entries(data.posts)) {
//     if (post.id === id) {
//       data.posts.splice(Number(index), 1);

//       return true;
//     }
//   }

//   return null;
// };

export const deleteAll = async () => {
  await postsCollection.deleteMany({});
};

// export const deleteAll = async () => {
//   try {
//     await Promise.resolve().then(() => data.posts.splice(0));
//   } catch (e) {
//     return null;
//   }

//   return true;
// };
