import { ObjectId, WithId } from 'mongodb';

import { SortDirection } from '@/enums';
import UserModel from '@/models/User';

declare global {
  namespace Express {
    export interface Request {
      userId: string;
      expDate: number;
      deviceId: string;
    }
  }
}

export interface FieldError {
  message: string | null;
  field: string | null;
}

export interface APIErrorResult {
  errorsMessages: FieldError[];
}

export interface Blog {
  _id: ObjectId;
  name: string;
  youtubeUrl: string;
  createdAt: Date;
}

export interface Post {
  _id: ObjectId;
  title: string;
  shortDescription: string;
  content: string;
  blogId: ObjectId;
  blogName: string;
  createdAt: Date;
}

export interface Paginator<T> {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: T;
}

export interface PaginationQuery {
  pageNumber: number;
  pageSize: number;
  sortBy: string;
  sortDirection: SortDirection;
  searchNameTerm?: RegExp;
  searchLoginTerm?: RegExp;
  searchEmailTerm?: RegExp;
}

export interface UserConfirmationType {
  isConfirmed: boolean;
  code: string;
  expDate: number;
}

export type PasswordRecoveryType = {
  code: string | null;
};

// export interface UserDBType {
//   _id: ObjectId;
//   login: string;
//   email: string;
//   password: string;
//   createdAt: Date;
//   confirmationInfo: UserConfirmationType;
//   passwordRecovery: PasswordRecoveryType;
// }

export type UserDBType = WithId<UserModel>;

export type UserModelType = {
  [Key in keyof UserDBType]: Key extends '_id' | 'createdAt'
    ? string
    : UserDBType[Key];
};

export interface Comment {
  _id: ObjectId;
  content: string;
  userId: ObjectId;
  userLogin: string;
  createdAt: Date;
}

export declare namespace h04 {
  interface BlogInputModel {
    name: string;
    youtubeUrl: string;
  }

  interface BlogViewModel {
    id: string;
    name: string;
    youtubeUrl: string;
    createdAt: string;
  }

  interface PostInputModel {
    title: string;
    content: string;
    shortDescription: string;
    blogId: string;
  }

  interface PostViewModel {
    id: string;
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
    blogName: string;
    createdAt: string;
  }
}

export declare namespace h05 {
  interface LoginInputModel {
    login: string;
    password: string;
  }

  interface UserInputModel {
    login: string;
    password: string;
    email: string;
  }

  interface UserViewModel {
    id: string;
    login: string;
    email: string;
    createdAt: string;
  }
}

export declare namespace h06 {
  interface CommentInputModel {
    content: string;
  }

  interface CommentViewModel {
    id: string;
    content: string;
    userId: string;
    userLogin: string;
    createdAt: string;
  }

  interface LoginSuccessViewModel {
    accessToken: string;
  }

  interface MeViewModel {
    email: string;
    login: string;
    userId: string;
  }
}

export declare namespace h07 {
  interface RegistrationConfirmationCodeModel {
    code: string;
  }

  interface RegistrationEmailResending {
    email: string;
  }
}

export declare namespace h09 {
  interface DeviceViewModel {
    ip: string;
    title: string;
    lastActiveDate: string;
    deviceId: string;
  }
}

export declare namespace h10 {
  interface NewPasswordRecoveryInputModel {
    newPassword: string;
    recoveryCode: string;
  }

  interface PasswordRecoveryInputModel {
    email: string;
  }
}

export declare namespace h11 {
  interface CommentViewModel {
    id: string;
    content: string;
    userId: string;
    createdAt: string;
    likesInfo: LikesInfoViewModel;
  }

  interface LikesInfoViewModel {
    likesCount: number;
    dislikesCount: number;
    myStatus: LikeStatus;
  }

  interface LikeInputModel {
    likeStatus: LikeStatus;
  }

  enum LikeStatus {
    None = 'None',
    Like = 'Like',
    Dislike = 'Dislike',
  }
}

export interface SecuirityDeviceInput {
  ip: string;
  title: string;
  deviceId: string;
  lastActiveDate: Date;
  userId: string;
}

export interface SecurityDevice {
  _id: ObjectId;
  ip: string;
  title: string;
  deviceId: string;
  lastActiveDate: Date;
  userId: string;
}

type DotPrefix<T extends string> = T extends '' ? '' : `.${T}`;

type DotNestedKeys<T> = (
  T extends object
    ? {
        [K in Exclude<keyof T, symbol>]: `${K}${DotPrefix<
          DotNestedKeys<T[K]>
        >}`;
      }[Exclude<keyof T, symbol>]
    : ''
) extends infer D
  ? Extract<D, string>
  : never;

export type UserUpdatesType = DotNestedKeys<Omit<Partial<UserDBType>, '_id'>>;

export interface Token {
  _id: ObjectId;
  value: string;
}

export interface TokenInputModel {
  value: string;
  expDate: string;
}

export interface UserForToken {
  login: string;
  userId: string;
  deviceId: string;
}

export type IpsType = { [key: string]: RateLimiter };

interface RateLimiter {
  count: number;
}
