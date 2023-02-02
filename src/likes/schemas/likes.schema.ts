import { Types } from 'mongoose';
import { prop } from '@typegoose/typegoose';

import { LikeStatuses } from 'root/@common/types/enum';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';

export interface LikeModel extends Base {}
export class LikeModel extends TimeStamps {
  @prop()
  entityId: Types.ObjectId;

  @prop()
  userId: number;

  @prop()
  login: string;

  @prop({ enum: LikeStatuses, default: LikeStatuses.None })
  likeStatus: LikeStatuses;

  @prop({ default: false })
  isBanned?: boolean;
}
