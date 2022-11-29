import { BlogBannedUser } from 'root/blogs/types';

export class BannedUserEntity implements BlogBannedUser {
  public userId: string | null = null;

  public banReason: string | null = null;

  public isBanned = false;

  constructor({ userId, banReason, isBanned }: BlogBannedUser) {
    this.userId = userId;
    this.banReason = banReason;
    this.isBanned = isBanned;
  }
}
