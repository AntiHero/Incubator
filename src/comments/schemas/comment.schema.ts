import { Types } from 'mongoose';
import { LikeModel } from 'root/likes/schemas/likes.schema';
import { prop, Ref } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';

export interface CommentModel extends Base {}
export class CommentModel extends TimeStamps {
  @prop()
  content: string;

  @prop()
  userId: number;

  @prop()
  entityId: Types.ObjectId;

  @prop()
  userLogin: string;

  @prop({ ref: () => LikeModel, default: [] })
  likes: Ref<LikeModel>[];

  @prop({ default: false })
  isBanned?: boolean;
}
