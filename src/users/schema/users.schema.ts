import { modelOptions, prop } from '@typegoose/typegoose';

import { createdAt } from 'root/_common';
// import mongoose from 'mongoose';
// import { UserDatabaseModel } from '../types';

// export const userSchema = new mongoose.Schema<UserDatabaseModel>(
//   {
//     login: {
//       type: String,
//       required: true,
//     },
//     email: {
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

// export const UserModel = mongoose.model('user', userSchema);

@modelOptions({ schemaOptions: createdAt })
export class UserModel {
  @prop({ required: true })
  login: string;

  @prop({ required: true })
  email: string;
}
