import mongoose from 'mongoose';
import { UserDatabaseModel } from '../types';

export const userSchema = new mongoose.Schema<UserDatabaseModel>(
  {
    login: {
      type: String,
      required: true,
    },
    email: {
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

export const UserModel = mongoose.model('user', userSchema);
