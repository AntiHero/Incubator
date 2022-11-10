import mongoose, { Schema } from 'mongoose';
import { PostDatabaseModel } from '../types';

export const postSchema = new mongoose.Schema<PostDatabaseModel>(
  {
    title: {
      type: String,
      required: true,
    },
    shortDescription: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    blogId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    comments: {
      type: [Schema.Types.ObjectId],
      ref: 'comment',
    },
    blogName: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: false,
    },
  },
);

export const PostModel = mongoose.model('post', postSchema);
