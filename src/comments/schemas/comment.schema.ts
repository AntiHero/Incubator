import { Types } from 'mongoose';
import { LikeModel } from 'root/likes/schemas/likes.schema';
import { prop, Ref } from '@typegoose/typegoose';

export class CommentModel {
  @prop()
  content: string;

  @prop()
  userId: Types.ObjectId;

  @prop()
  entityId: Types.ObjectId;

  @prop()
  userLogin: string;

  @prop({ ref: () => LikeModel, default: [] })
  likes: Ref<LikeModel>[];

  @prop()
  createdAt: Date;
}
