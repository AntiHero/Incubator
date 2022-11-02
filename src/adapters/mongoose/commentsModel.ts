import mongoose, { Schema } from 'mongoose';

import { CommentDBType } from '@/@types';

const commentSchema = new mongoose.Schema<CommentDBType>(
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
    postId: {
      type: Schema.Types.ObjectId,
    },
    userLogin: {
      type: String,
    },
    likesInfo: {
      likesCount: Number,
      dislikesCount: Number,
      myStatus: {
        type: String,
        enum: ['None', 'Dislike', 'Like'],
      },
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

commentSchema.virtual('id').get(function () {
  return this._id.toString();
});

export const CommentModel = mongoose.model('comment', commentSchema);
