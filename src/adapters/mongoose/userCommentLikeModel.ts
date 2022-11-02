import mongoose, { Schema } from 'mongoose';

import { LikeStatus } from '@/@types';
import { UserCommentLikeDB } from './types';

const userCommentLikeSchema = new mongoose.Schema<UserCommentLikeDB>(
  {
    userId: {
      type: Schema.Types.ObjectId,
    },
    commentId: {
      type: Schema.Types.ObjectId,
    },
    likeStatus: {
      type: String,
      enum: [...Object.values(LikeStatus)],
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const UserCommentLikeModel = mongoose.model(
  'userCommentLike',
  userCommentLikeSchema
);
