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
  login: string;
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

// export type BloggerCommentsViewModel = {

// }
