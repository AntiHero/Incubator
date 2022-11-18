import { Schema, HydratedDocument, LeanDocument } from 'mongoose';

import { WithId } from 'root/@common/types/utility';
import { LikesInfoViewModel } from 'root/@common/types';
import { LikeDatabaseModel, LikeDTO } from 'root/likes/types';
import { LikeStatuses } from 'root/@common/types/enum';

export type CommentSchemaModel = {
  content: string;
  userId: Schema.Types.ObjectId;
  entityId: Schema.Types.ObjectId;
  likes: LikeDatabaseModel[];
  userLogin: string;
  createdAt: Date;
};

export type CommentDatabaseModel = HydratedDocument<CommentSchemaModel>;

export type CommentLeanModel = LeanDocument<CommentDatabaseModel>;

export type CommentDomainModel = {
  content: string;
  userId: string;
  userLogin: string;
};

export type CommentDTO = {
  id: string;
  content: string;
  userId: string;
  entityId: string;
  likes: LikeDTO[];
  userLogin: string;
  createdAt: string;
};

export type CommentDomainModelWithId = WithId<CommentDomainModel>;

export type CommentInputModel = {
  content: string;
};

export type CommentViewModel = {
  readonly id: string;
  content: string;
  userId: string;
  userLogin: string;
  createdAt: string;
  likesInfo: LikesInfoViewModel;
};

export type CommentExtendedLikesDTO = {
  id: string;
  content: string;
  userId: string;
  entityId: string;
  userLogin: string;
  createdAt: string;
  likesCount: number;
  dislikesCount: number;
  userStatus: LikeStatuses;
};
