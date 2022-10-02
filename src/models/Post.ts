import { h02 } from '@/@types';

class Post implements h02.db.PostInputModel {
  constructor(
    public title: string,
    public shortDescription: string,
    public content: string,
    public blogId: string,
    public blogName: string
  ) {
    this.title = title;
    this.shortDescription = shortDescription;
    this.content = content;
    this.blogId = blogId;
    this.blogName = blogName;
  }

  public async save() {
    return Promise.resolve().then(() => {
      const post = {
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
