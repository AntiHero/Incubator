import { HydratedDocument, LeanDocument } from 'mongoose';

import { LikeStatuses } from 'root/@core/types/enum';

import type {
  PostDatabaseModel,
  PostDomainModel,
  PostDTO,
} from 'root/posts/types';
import type { BanInfo } from 'root/users/types';
import type { CommentDTO } from 'root/comments/types';
import type { WithId } from 'root/@core/types/utility';
import type { BanType, PhotoSizeViewModel } from 'root/@core/types';

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
  images?: [
    {
      type: ImageType;
      height: number;
      width: number;
      fileSize: number;
      url: string;
    },
  ];
  // images?: BlogImagesViewModel;
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
  images?: BlogImagesViewModel;
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

export type BlogsWithImagesQueryResult = {
  id: number;
  name: string;
  description: string;
  websiteUrl: string;
  banInfo: BanInfo;
  createdAt: Date;
  userId: number;
  isMembership: boolean;
  images?: [
    {
      type: ImageType;
      fileSize: number;
      width: number;
      height: number;
      url: string;
    },
  ];
};

export type GroupedBlogsWithImages = {
  id: number;
  name: string;
  description: string;
  websiteUrl: string;
  banInfo: BanInfo;
  createdAt: Date;
  userId: number;
  isMembership: boolean;
  images: {
    wallpaper: PhotoSizeViewModel;
    main: PhotoSizeViewModel[];
  };
};

export type BlogsWithImagesQueryResult = {
  id: number;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: Date;
  isMembership: boolean;
  images: [
    {
      type: ImageType;
      height: number;
      width: number;
      fileSize: number;
    },
  ];
};
