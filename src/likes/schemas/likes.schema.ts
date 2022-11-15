import { Types } from 'mongoose';
import { prop } from '@typegoose/typegoose';

import { LikeStatuses } from 'root/_common/types/enum';

export class LikeModel {
  @prop()
  entityId: Types.ObjectId;

  @prop()
  userId: Types.ObjectId;

  @prop()
  login: string;

  @prop({ enum: LikeStatuses, default: LikeStatuses.None })
  likeStatus: LikeStatuses;

  @prop()
  addedAt: Date;
}
