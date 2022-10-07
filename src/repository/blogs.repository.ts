import { ObjectId } from 'mongodb';

import { countSkip } from '@/utils/countSkip';
import { convertToBlog } from '@/utils/convertToBlog';
import { h04, Blog, Post, PaginationQuery } from '@/@types';
import { blogsCollection, postsCollection } from './collections';

export const getAllBlogs = async () => {
  const cursor = blogsCollection.find<Blog>({});

  const blogs: h04.BlogViewModel[] = [];

  await cursor.forEach((doc) => {
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

export const getBlogPostsCount = async (id: string) => {
  const blog = await blogsCollection.findOne<Blog>({ _id: new ObjectId(id) });

  if (blog === null) return null;

  const cursor = await postsCollection
    .aggregate<{ totalCount: number }>([
      {
        $match: { blogId: new ObjectId(id) },
      },
      {
        $count: 'totalCount',
      },
    ])
    .toArray();

  return cursor.length ? cursor[0].totalCount : 0;
};

export const getBlogsCount = async (query: Partial<PaginationQuery>) => {
  const cursor = await blogsCollection
    .aggregate<{ totalCount: number }>([
      {
        $match: { name: { $regex: query.searchNameTerm } },
      },
      {
        $count: 'totalCount',
      },
    ])
    .toArray();

  return cursor.length ? cursor[0].totalCount : 0;
};

export const findBlogPostsByQuery = async (
  id: string,
  query: PaginationQuery
) => {
  const blog = await blogsCollection.findOne<Blog>({ _id: new ObjectId(id) });

  if (blog === null) return null;

  const posts = await postsCollection
    .aggregate<Post>([
      {
        $match: { blogId: new ObjectId(id) },
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
  console.log(posts);
  return posts;
};

export const findBlogsByQuery = async (query: PaginationQuery) => {
  const blogs = await blogsCollection
    .aggregate<Blog>([
      {
        $match: { name: { $regex: query.searchNameTerm } },
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

  return blogs;
};
