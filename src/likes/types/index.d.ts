import { Schema, HydratedDocument, LeanDocument } from 'mongoose';

import { LikeStatuses } from 'root/_common/types/enum';

export type LikeSchemaModel = {
  entityId: Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId;
  likeStatus: LikeStatuses;
  login: string;
  addedAt: Date;
};

export type LikeDTO = {
  id: string;
  userId: string;
  entityId: string;
  likeStatus: LikeStatuses;
  login: string;
  addedAt: string;
};

export type LikeDatabaseModel = HydratedDocument<LikeSchemaModel>;

export type LikeLeanModel = LeanDocument<LikeDatabaseModel>;

export type LikeDomainModel = {
  userId: string;
  entityId: string;
  likeStatus: LikeStatuses;
  login: string;
};

export type LikeInputModel = {
  likeStatus: LikeStatuses;
};

export type LikeViewModel = {
  userId: string;
  login: string;
  addedAt: string;
};

type ExtendedLikesInfoViewModel = {
  likesCount: number;
  dislikesCount: number;
  myStatus: LikeStatus;
  newestLikes: LikeViewModel[];
};
