import { HydratedDocument, LeanDocument } from 'mongoose';
import { PostDatabaseModel, PostDomainModel, PostDTO } from 'root/posts/types';

import { BanType } from 'root/@core/types';
import { CommentDTO } from 'root/comments/types';
import { WithId } from 'root/@core/types/utility';
import { LikeDTO } from 'root/likes/types';
import { LikeStatuses } from 'root/@core/types/enum';

export type BlogSchemaModel = {
  name: string;
  description: string;
  websiteUrl: string;
  posts: PostDatabaseModel[];
  createdAt: Date;
};

export type BlogDatabaseModel = HydratedDocument<BlogSchemaModel>;

export type BlogLeanModel = LeanDocument<BlogDatabaseModel>;

export type BlogDomainModel = {
  name: string;
  description: string;
  websiteUrl: string;
  userId: string | null;
  posts: PostDomainModel[];
};

type BlogBannedUser = {
  userId: string | null;
  banReason: string | null;
  isBanned: boolean;
};

export type BlogDTO = {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  userId: string | null;
  posts: PostDTO[];
  createdAt: string;
  banInfo: BanType;
};

export type BlogDomainModelWithId = WithId<BlogDomainModel>;

export type BlogInputModel = {
  name: string;
  description: string;
  websiteUrl: string;
};

export type BlogViewModel = {
  readonly id: string;
  name: string;
  websiteUrl: string;
  description: string;
  createdAt: string;
};

export type BlogCommentType = CommentDTO & {
  blogId: Types.ObjectId;
  blogName: string;
  likesCount: number;
  dislikesCount: number;
  userStatus: LikeStatuses;
  postId: Types.ObjectId;
  title: string;
};
