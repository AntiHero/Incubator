import { h04 } from '@/@types';

class Blog implements h04.BlogInputModel {
  constructor (public name: string, public youtubeUrl: string) {
    this.name = name;
    this.youtubeUrl = youtubeUrl;
  }

  public async save () {
    return Promise.resolve().then(() => {
      const blog = {
        name: this.name,
        youtubeUrl: this.youtubeUrl,
      };

      return blog;
    });
  }
}

export default Blog;
