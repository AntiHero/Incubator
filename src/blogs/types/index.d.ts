import { HydratedDocument, LeanDocument } from 'mongoose';
import { PostDatabaseModel, PostDomainModel, PostDTO } from 'root/posts/types';

import { WithId } from 'root/_common/types/utility';

export type BlogSchemaModel = {
  name: string;
  youtubeUrl: string;
  posts: PostDatabaseModel[];
  createdAt: Date;
};

export type BlogDatabaseModel = HydratedDocument<BlogSchemaModel>;

export type BlogLeanModel = LeanDocument<BlogDatabaseModel>;

export type BlogDomainModel = {
  name: string;
  youtubeUrl: string;
  posts: PostDomainModel[];
};

export type BlogDTO = {
  id: string;
  name: string;
  youtubeUrl: string;
  posts: PostDTO[];
  createdAt: string;
};

export type BlogDomainModelWithId = WithId<BlogDomainModel>;

export type BlogInputModel = {
  name: string;
  youtubeUrl: string;
};

export type BlogViewModel = {
  readonly id: string;
  name: string;
  youtubeUrl: string;
  createdAt: string;
};
