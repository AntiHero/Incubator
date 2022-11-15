import { prop, Ref } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';

import { PostModel } from 'root/posts/schemas/post.schema';

export interface BlogModel extends Base {}
export class BlogModel extends TimeStamps {
  @prop()
  name: string;

  @prop()
  youtubeUrl: string;

  @prop({ ref: () => PostModel, default: [] })
  posts: Ref<PostModel>[];
}
