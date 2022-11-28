import { BanType } from 'root/@common/types';
import { BlogViewModel } from 'root/blogs/types';

export type BlogWithExtendedOwnerInfoType = BlogViewModel & {
  blogOwnerInfo: {
    userId: string;
    userLogin: string;
  };
};

export type BlogWithBanInfo = BlogWithExtendedOwnerInfoType & {
  banInfo: BanType;
};

export type BlogSaViewModel = BlogViewModel & {
  banInfo: BanType;
};
