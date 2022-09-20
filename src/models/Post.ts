import { v4 as uuidv4 } from 'uuid';

import { h02 } from '../@types';

class Post implements h02.db.PostViewModel {
  public id: string | null = null;

  constructor (
    public title: string,
    public shortDescription: string,
    public content: string,
    public blogId: string,
    public blogName: string
  ) {
    this.id = uuidv4();
    this.title = title;
    this.shortDescription = shortDescription;
    this.content = content;
    this.blogId = blogId;
    this.blogName = blogName;
  }

  public async save () {
    return Promise.resolve().then(() => {
      const post = {
        id: this.id,
        title: this.title,
        shortDescription: this.shortDescription,
        content: this.content,
        blogId: this.blogId,
      };

      return post;
    });
  }
}

export default Post;
