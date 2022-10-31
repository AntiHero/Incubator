import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

import UserModel from '@/models/User';
import { fiveMinInMs } from '@/constants';

const userSchema = new mongoose.Schema<UserModel>(
  {
    login: {
      type: String,
      min: 3,
      max: 10,
      required: true,
    },
    password: {
      type: String,
      min: 6,
      max: 20,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    confirmationInfo: {
      code: {
        type: String,
        default: uuidv4(),
      },
      isConfirmed: {
        type: Boolean,
        default: false,
      },
      expDate: {
        type: Number,
        default: Date.now() + fiveMinInMs,
      },
    },
    passwordRecovery: {
      code: {
        type: String,
        default: null,
      },
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

userSchema.virtual('id').get(function () {
  return this._id.toString();
});

export const User = mongoose.model('user', userSchema);
