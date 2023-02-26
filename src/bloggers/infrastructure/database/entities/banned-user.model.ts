import { BannedUserForEntity } from '../../../@common/types';

export class BannedUserEntity implements BannedUserForEntity {
  public user: string;

  public banReason: string | null;

  public isBanned = false;

  public entityId: string;

  public banDate: Date;

  constructor({
    user,
    entityId,
    banReason = null,
    isBanned = false,
    banDate = new Date(),
  }: Partial<BannedUserForEntity>) {
    this.user = user;
    this.banReason = banReason;
    this.isBanned = isBanned;
    this.entityId = entityId;
    this.banDate = banDate;
  }
}
