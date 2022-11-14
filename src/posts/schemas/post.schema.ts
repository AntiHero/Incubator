import { Types } from 'mongoose';
import { LikeModel } from 'root/likes/schemas/likes.schema';
import { modelOptions, prop, Ref } from '@typegoose/typegoose';
import { CommentModel } from 'root/comments/schemas/comment.schema';

import { createdAt } from 'root/_common';
// import mongoose, { Schema } from 'mongoose';
// import { PostDatabaseModel } from '../types';

// export const postSchema = new mongoose.Schema<PostDatabaseModel>(
//   {
//     title: {
//       type: String,
//       required: true,
//     },
//     shortDescription: {
//       type: String,
//       required: true,
//     },
//     content: {
//       type: String,
//       required: true,
//     },
//     blogId: {
//       type: Schema.Types.ObjectId,
//       required: true,
//     },
//     comments: [{ type: Schema.Types.ObjectId, ref: 'comment' }],
//     likes: [
//       {
//         type: Schema.Types.ObjectId,
//         ref: 'like',
//       },
//     ],
//     blogName: {
//       type: String,
//       required: true,
//     },
//   },
//   {
//     timestamps: {
//       createdAt: true,
//       updatedAt: false,
//     },
//   },
// );

// export const postmodel = mongoose.model('post', postschema);

@modelOptions({ schemaOptions: createdAt })
export class PostModel {
  @prop({ required: true })
  title: string;

  @prop({ required: true })
  shortDescription: string;

  @prop()
  content: string;

  @prop()
  blogId: Types.ObjectId;

  @prop()
  blogName: string;

  @prop({ ref: () => CommentModel, default: [] })
  comments: Ref<CommentModel>[];

  @prop({ ref: () => LikeModel, default: [] })
  likes: Ref<LikeModel>[];
}
