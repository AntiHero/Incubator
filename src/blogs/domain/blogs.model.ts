import { BlogDomainModel } from 'root/blogs/types';
import { Post } from 'root/posts/domain/posts.model';

class Blog implements BlogDomainModel {
  public posts: Post[] = [];

  constructor(
    public name: string,
    public description: string,
    public websiteUrl: string,
    public userId: string | null = null,
  ) {
    this.name = name;
    this.websiteUrl = websiteUrl;
    this.description = description;
    this.userId = userId;
  }
}

export default Blog;
