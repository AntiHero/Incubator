import data from '../fakeDb';
import { h02 } from '../@types';

export const getAllBlogs = async (): Promise<h02.db.BlogViewModel[]> => {
  return Promise.resolve().then(() => data.blogs);
};

export const saveBlog = async (blog: h02.db.BlogViewModel) => {
  return Promise.resolve().then(() => data.blogs.push(blog));
};

export const findBlogById = async (id: string) => {
  for (const blog of data.blogs) {
    if (blog.id === id) return Promise.resolve().then(() => blog);
  }

  return null;
};

export const findBlogByIdAndUpdate = async (
  id: string,
  { name, youtubeUrl }: h02.db.BlogInputModel
) => {
  for (const blog of data.blogs) {
    if (blog.id === id)
      return Promise.resolve().then(() => {
        blog.name = name;
        blog.youtubeUrl = youtubeUrl;
      });
  }

  return null;
};

export const findBlogByIdAndDelete = async (id: string) => {
  for (const [index, blog] of Object.entries(data.blogs)) {
    if (blog.id === id) {
      data.blogs.splice(Number(index), 1);
      
      return true;
    }
  }

  return null;
};

export const deleteAll = async () => {
  try {
    await Promise.resolve().then(() => data.blogs.splice(0));
    await Promise.resolve().then(() => data.posts.splice(0));
  } catch (e) {
    return null;
  }

  return true;
};
