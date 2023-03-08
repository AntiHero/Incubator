import { Schema, HydratedDocument, LeanDocument } from 'mongoose';

import type { ImagesDBType, PhotoSizeViewModel } from 'root/@core/types';
import type { PostImageDTO } from 'root/bloggers/@common/types';
import { ImageType, LikeStatuses } from 'root/@core/types/enum';
import type { WithId } from 'root/@core/types/utility';
import type {
  CommentDatabaseModel,
  CommentDomainModel,
  CommentDTO,
} from 'root/comments/types';
import type {
  ExtendedLikesInfoViewModel,
  LikeDatabaseModel,
  LikeDomainModel,
  LikesDBType,
  LikeDTO,
} from 'root/likes/types';

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
  blogName?: string;
  comments?: CommentDTO[];
  likes?: LikeDTO[];
  createdAt: string;
  size?: number;
  url?: string;
  height?: number;
  width?: number;
};

export type PostExtendedLikesDTO = {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName?: string;
  createdAt: string;
  likesCount: number;
  dislikesCount: number;
  userStatus: LikeStatuses;
  newestLikes?: LikeDTO[];
  images?: PostImagesViewModel;
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

export type PostExtendedViewModel = {
  id: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
  title: string;
  extendedLikesInfo: ExtendedLikesInfoViewModel;
  images: PostImagesViewModel;
};

export type PostImagesViewModel = {
  main: PhotoSizeViewModel[];
};

// type PostsWithImagesQueryResultType = {
//   id: number;
//   shortDescription: string;
//   content: string;
//   blogId: number;
//   blogName: string;
//   title: string;
//   createdAt: Date;
//   size: number;
//   width: number;
//   height: number;
//   url: string;
// };

type ExtendedPostQueryResult = {
  id: number;
  title: string;
  content: string;
  shortDescription: string;
  createdAt: Date;
  blogId: number;
  blogName: string;
  likesCount: number;
  dislikesCount: number;
  userLikeStatus: LikeStatuses;
  images: ImagesDBType[] | null;
  likes: LikesDBType[] | null;
};

// type PostsWithImagesDTO = {
//   id: string;
//   shortDescription: string;
//   content: string;
//   blogId: string;
//   blogName: string;
//   title: string;
//   createdAt: string;
//   images: PostImagesViewModel;
// };
