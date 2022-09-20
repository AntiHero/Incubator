import data from '../fakeDb';
import { h02 } from '../@types';

export const getAllBlogs = async (): Promise<h02.db.BlogViewModel[]> => {
  return Promise.resolve().then(() => data.blogs);
};

export const saveBlog = async (blog: h02.db.BlogViewModel) => {
  return Promise.resolve().then(() => data.blogs.push(blog));
};
