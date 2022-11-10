import { BlogDomainModel } from 'root/blogs/types';
import { Post } from 'root/posts/domain/posts.model';

class Blog implements BlogDomainModel {
  public posts: Post[] = [];

  constructor(public name: string, public youtubeUrl: string) {
    this.name = name;
    this.youtubeUrl = youtubeUrl;
  }
}

export default Blog;
