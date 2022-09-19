import { h02 } from '../@types';

class Blog implements h02.db.BlogViewModel {
  public id: string | null = null;

  public name: string | null = null;

  public youtubeUrl: string | null = null;
}

export default Blog;
