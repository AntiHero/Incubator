import { Types } from 'mongoose';

import { LikeStatus } from '@/@types';

export type UserCommentLikeDB = {
  userId: Types.ObjectId;
  commentId: Types.ObjectId;
  likeStatus: LikeStatus;
};
