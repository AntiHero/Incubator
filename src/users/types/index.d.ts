import { HydratedDocument, LeanDocument } from 'mongoose';

import { WithId } from 'root/_common/types/utility';

export type UserSchemaModel = {
  login: string;
  email: string;
  createdAt: Date;
};

export type UserDatabaseModel = HydratedDocument<UserSchemaModel>;

export type UserLeanModel = LeanDocument<UserDatabaseModel>;

export type UserDomainModel = {
  login: string;
  email: string;
};

export type BanInfo = {
  banDate: string | null;
  banReason: string | null;
  isBanned: boolean;
};

export type UserDTO = {
  id: string;
  login: string;
  email: string;
  banInfo: BanInfo;
  createdAt: string;
};

export type UserDomainModelWithId = WithId<UserDomainModel>;

export type UserInputModel = {
  login: string;
  email: string;
};

export type UserViewModel = {
  readonly id: string;
  login: string;
  email: string;
  createdAt: string;
};
