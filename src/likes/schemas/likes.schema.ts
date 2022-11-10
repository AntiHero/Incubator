import mongoose, { Schema } from 'mongoose';

import { LikeSchemaModel } from '../types';
import { LikeStatuses } from 'root/_common/types/enum';

const likeSchema = new mongoose.Schema<LikeSchemaModel>(
  {
    entityId: {
      type: Schema.Types.ObjectId,
    },
    userId: {
      type: Schema.Types.ObjectId,
    },
    login: {
      type: String,
    },
    likeStatus: {
      type: String,
      enum: [...Object.keys(LikeStatuses)],
      default: LikeStatuses.None,
    },
  },
  { timestamps: { createdAt: 'addedAt', updatedAt: false } },
);

export const LikeModel = mongoose.model('like', likeSchema);
