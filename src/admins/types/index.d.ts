import { BlogViewModel } from 'root/blogs/types';

export type BlogWithExtendedOwnerInfoType = BlogViewModel & {
  blogOwnerInfo: {
    userId: string;
    userLogin: string;
  };
};
