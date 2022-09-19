import { h02 } from "../@types";

class Post implements h02.db.PostViewModel {
  public id: string | null = null;

  public title: string | null = null;
  
  public shortDescription: string | null = null;

  public content: string | null = null;

  public blogId: string | null = null;

  public blogName: string | null = null;
}

export default Post;
