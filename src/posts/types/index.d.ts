import { Schema, HydratedDocument, LeanDocument } from 'mongoose';

import { WithId } from 'root/_common/types/utility';
import {
  CommentDatabaseModel,
  CommentDomainModel,
  CommentDTO,
} from 'root/comments/types';

export type PostSchemaModel = {
  title: string;
  shortDescription: string;
  content: string;
  blogId: Schema.Types.ObjectId;
  blogName: string;
  comments: CommentDatabaseModel[];
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
};

export type PostDTO = {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  comments: CommentDTO[];
  createdAt: string;
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
