import { Schema, HydratedDocument, LeanDocument } from 'mongoose';

import type { PostImageDTO } from 'root/bloggers/@common/types';
import type { PhotoSizeViewModel } from 'root/@core/types';
import type { WithId } from 'root/@core/types/utility';
import { LikeStatuses } from 'root/@core/types/enum';
import type {
  CommentDatabaseModel,
  CommentDomainModel,
  CommentDTO,
} from 'root/comments/types';
import type {
  ExtendedLikesInfoViewModel,
  LikeDatabaseModel,
  LikeDomainModel,
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
  images?: PostImageDTO[];
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
