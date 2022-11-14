import { Types } from 'mongoose';
import { LikeModel } from 'root/likes/schemas/likes.schema';
import { modelOptions, prop, Ref } from '@typegoose/typegoose';

import { createdAt } from 'root/_common';

@modelOptions({ schemaOptions: createdAt })
export class CommentModel {
  @prop()
  content: string;

  @prop()
  userId: Types.ObjectId;

  @prop()
  entityId: Types.ObjectId;

  @prop()
  userLogin: string;

  @prop({ ref: () => LikeModel, default: [] })
  likes: Ref<LikeModel>[];
}

// import mongoose, { Schema } from 'mongoose';

// import { CommentSchemaModel } from 'root/comments/types';

// export const commentSchema = new mongoose.Schema<CommentSchemaModel>(
//   {
//     content: {
//       type: String,
//       // min: 20,
//       // max: 300,
//       required: true,
//     },
//     userId: {
//       type: Schema.Types.ObjectId,
//     },
//     entityId: {
//       type: Schema.Types.ObjectId,
//     },
//     userLogin: {
//       type: String,
//     },
//     likes: [
//       {
//         type: Schema.Types.ObjectId,
//         ref: 'like',
//       },
//     ],
//   },
//   { timestamps: { createdAt: true, updatedAt: false } },
// );

// export const CommentModel = mongoose.model('comment', commentSchema);
