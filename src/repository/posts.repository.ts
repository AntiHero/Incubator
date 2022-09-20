import data from '../fakeDb';
import { h02 } from '../@types';

export const getAllPosts = async (): Promise<h02.db.PostViewModel[]> => {
  return Promise.resolve().then(() => data.posts);
};

export const savePost = async (post: h02.db.PostViewModel) => {
  for (const blog of data.blogs) {
    if (blog.id === post.blogId) {
      return Promise.resolve().then(() => data.posts.push(post));
    }
  }

  return null;
};

export const findPostById = async (id: string) => {
  for (const post of data.posts) {
    if (post.id === id) return Promise.resolve().then(() => post);
  }

  return null;
};

export const findPostByIdAndUpdate = async (
  id: string,
  { content, title, shortDescription, blogId }: h02.db.PostInputModel
) => {
  for (const blog of data.blogs) {
    if (blog.id === blogId) {
      for (const post of data.posts) {
        if (post.id === id)
          return Promise.resolve().then(() => {
            post.content = content;
            post.title = title;
            post.shortDescription = shortDescription;
            post.blogId = blogId;
          });
      }
    }
  }

  return null;
};

export const findPostByIdAndDelete = async (id: string) => {
  for (const [index, post] of Object.entries(data.posts)) {
    if (post.id === id) {
      data.posts.splice(Number(index), 1);

      return true;
    }
  }

  return null;
};

export const deleteAll = async () => {
  try {
    await Promise.resolve().then(() => data.posts.splice(0));
  } catch (e) {
    return null;
  }

  return true;
};
