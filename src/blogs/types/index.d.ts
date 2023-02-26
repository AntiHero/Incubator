import { HydratedDocument, LeanDocument } from 'mongoose';
import { PostDatabaseModel, PostDomainModel, PostDTO } from 'root/posts/types';

import { CommentDTO } from 'root/comments/types';
import { WithId } from 'root/@core/types/utility';
import { LikeStatuses } from 'root/@core/types/enum';
import { BanType, PhotoSizeViewModel } from 'root/@core/types';

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
  isMembership?: boolean;
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
  isMembership?: boolean;
  // images?: BlogImagesViewModel;
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

export type BlogWithImagesViewModel = BlogViewModel & {
  images: BlogImagesViewModel;
};

export type BlogImagesViewModel = {
  wallpaper: PhotoSizeViewModel;
  main: PhotoSizeViewModel[];
};
