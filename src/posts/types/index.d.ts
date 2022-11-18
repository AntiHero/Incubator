import { Schema, HydratedDocument, LeanDocument } from 'mongoose';

import { WithId } from 'root/@common/types/utility';
import {
  CommentDatabaseModel,
  CommentDomainModel,
  CommentDTO,
} from 'root/comments/types';
import {
  ExtendedLikesInfoViewModel,
  LikeDatabaseModel,
  LikeDomainModel,
  LikeDTO,
} from 'root/likes/types';
import { LikeStatuses } from 'root/@common/types/enum';

export type PostSchemaModel = {
  title: string;
  shortDescription: string;
  content: string;
  blogId: Schema.Types.ObjectId;
  blogName: string;
  comments: CommentDatabaseModel[];
  likes: LikeDatabaseModel[];
  createdAt: Date;
};

export type PostDatabaseModel = HydratedDocument<PostSchemaModel>;

export type PostLeanModel = LeanDocument<PostDatabaseModel>;

export type PostDomainModel = {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  comments: CommentDomainModel[];
  likes: LikeDomainModel[];
};

export type PostDTO = {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  comments: CommentDTO[];
  likes: LikeDTO[];
  createdAt: string;
};

export type PostExtendedLikesDTO = {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
  likesCount: number;
  dislikesCount: number;
  userStatus: LikeStatuses;
  newestLikes: LikeDTO[];
};

export type PostDomainModelWithId = WithId<PostDomainModel>;

export type PostInputModel = {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
};

export type PostViewModel = {
  readonly id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
};

export type PostBody = {
  title: string;
  shortDescription: string;
  content: string;
};

export type PostExtendedViewModel = {
  id: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
  title: string;
  extendedLikesInfo: ExtendedLikesInfoViewModel;
};
