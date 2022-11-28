import { HydratedDocument, LeanDocument } from 'mongoose';
import { PostDatabaseModel, PostDomainModel, PostDTO } from 'root/posts/types';

import { WithId } from 'root/@common/types/utility';
import { BanType } from 'root/@common/types';

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
