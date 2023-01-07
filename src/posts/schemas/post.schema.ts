import { Types } from 'mongoose';
import { prop, Ref } from '@typegoose/typegoose';
import { LikeModel } from 'root/likes/schemas/likes.schema';
import { CommentModel } from 'root/comments/schemas/comment.schema';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';

export interface PostModel extends Base {}
export class PostModel extends TimeStamps {
  @prop({ required: true })
  title: string;

  @prop()
  shortDescription: string;

  @prop()
  content: string;

  @prop()
  blogId: Types.ObjectId;

  @prop()
  blogName: string;

  @prop({ ref: () => CommentModel, default: [] })
  comments: Ref<CommentModel>[];

  @prop({ ref: () => LikeModel, default: [] })
  likes: Ref<LikeModel>[];
}
