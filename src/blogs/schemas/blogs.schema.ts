import { Types } from 'mongoose';
import { prop, Ref } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';

import { PostModel } from 'root/posts/schemas/post.schema';

class BanInfo {
  @prop({ default: null })
  banDate: Date | null;

  @prop({ default: false })
  isBanned: boolean;
}

export interface BlogModel extends Base {}
export class BlogModel extends TimeStamps {
  @prop()
  name: string;

  @prop()
  description: string;

  @prop()
  websiteUrl: string;

  @prop({ ref: () => PostModel, default: [] })
  posts: Ref<PostModel>[];

  @prop({ default: null })
  userId: Types.ObjectId | null;

  @prop({ default: new BanInfo(), _id: false })
  banInfo: BanInfo;
}
