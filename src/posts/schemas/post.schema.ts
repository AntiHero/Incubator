import { Types } from 'mongoose';
import { LikeModel } from 'root/likes/schemas/likes.schema';
import { prop, Ref } from '@typegoose/typegoose';
import { CommentModel } from 'root/comments/schemas/comment.schema';

export class PostModel {
  @prop({ required: true })
  title: string;

  @prop({ required: true })
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

  @prop()
  createdAt: Date;
}
