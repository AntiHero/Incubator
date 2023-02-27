import type { LikeDTO } from 'root/likes/types';
import type { LikesInfoViewModel } from 'root/@core/types';
import type { ImageType, LikeStatuses } from 'root/@core/types/enum';

export type BannedUserForEntity = {
  entityId: string;
  user: string;
  banReason?: string | null;
  isBanned?: boolean;
  banDate?: Date;
};

export type BannedUserForEntityDTO = {
  id: string;
  entityId: string;
  userId: string;
  login?: string;
  isBanned: boolean;
  banReason: string;
  banDate: string;
};

export type BannedUserForEntityViewModel = {
  id: string;
  login: string;
  banInfo: {
    isBanned: boolean;
    banDate: string;
    banReason: string;
  };
};

export type BloggerCommentsViewModel = {
  id: string;
  content: string;
  createdAt: string;
  likesInfo: LikesInfoViewModel;
  commentatorInfo: {
    userId: string;
    userLogin: string;
  };
  postInfo: {
    id: string;
    title: string;
    blogId: string;
    blogName: string;
  };
};

export type BloggerCommentDTO = {
  id: string;
  content: string;
  userId: string;
  likes?: LikeDTO[];
  isBanned: boolean;
  likesCount?: number;
  dislikesCount?: number;
  userStatus?: LikeStatuses;
  userLogin: string;
  createdAt: string;
  blogName: string;
  blogId: string;
  postId: string;
  title: string;
};

export type BlogImageDTO = {
  id: number;
  name: string;
  type: ImageType;
  height: number;
  width: number;
  url: string;
  size: number;
  blogId: number;
  createdAt: string;
};

export type BlogImageInputModel = Omit<BlogImageDTO, 'id' | 'createdAt'>;
