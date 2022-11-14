import { Types } from 'mongoose';
import { modelOptions, prop } from '@typegoose/typegoose';

import { LikeStatuses } from 'root/_common/types/enum';
// import mongoose, { Schema } from 'mongoose';

// import { LikeSchemaModel } from '../types';
// import { LikeStatuses } from 'root/_common/types/enum';

// export const likeSchema = new mongoose.Schema<LikeSchemaModel>(
//   {
//     entityId: {
//       type: Schema.Types.ObjectId,
//     },
//     userId: {
//       type: Schema.Types.ObjectId,
//     },
//     login: {
//       type: String,
//     },
//     likeStatus: {
//       type: String,
//       enum: [...Object.keys(LikeStatuses)],
//       default: LikeStatuses.None,
//     },
//   },
//   { timestamps: { createdAt: 'addedAt', updatedAt: false } },
// );

// export const LikeModel = mongoose.model('like', likeSchema);

@modelOptions({
  schemaOptions: {
    timestamps: {
      createdAt: 'addedAt',
      updatedAt: false,
    },
  },
})
export class LikeModel {
  @prop()
  entityId: Types.ObjectId;

  @prop()
  userId: Types.ObjectId;

  @prop()
  login: string;

  @prop({ enum: LikeStatuses, default: LikeStatuses.None })
  likesStatus: string;
}
