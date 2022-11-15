import { prop, Ref } from '@typegoose/typegoose';

import { PostModel } from 'root/posts/schemas/post.schema';

export class BlogModel {
  @prop()
  name: string;

  @prop()
  youtubeUrl: string;

  @prop({ ref: () => PostModel, default: [] })
  posts: Ref<PostModel>[];

  @prop()
  createdAt: Date;
}
