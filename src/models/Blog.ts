import { v4 as uuidv4 } from 'uuid';

import { h02 } from '../@types';

class Blog implements h02.db.BlogViewModel {
  public id: string | null = null;

  constructor (public name: string, public youtubeUrl: string) {
    this.id = uuidv4();
    this.name = name;
    this.youtubeUrl = youtubeUrl;
  }

  public async save () {
    return Promise.resolve().then(() => {
      const blog = {
        id: this.id,
        name: this.name,
        youtubeUrl: this.youtubeUrl,
      };

      return blog;
    });
  }
}

export default Blog;
