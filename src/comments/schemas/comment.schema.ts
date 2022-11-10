import mongoose, { Schema } from 'mongoose';

import { CommentSchemaModel } from 'root/comments/types';

export const commentSchema = new mongoose.Schema<CommentSchemaModel>(
  {
    content: {
      type: String,
      min: 20,
      max: 300,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
    },
    entityId: {
      type: Schema.Types.ObjectId,
    },
    userLogin: {
      type: String,
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'like',
      },
    ],
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

export const CommentModel = mongoose.model('comment', commentSchema);
