import { LikeStatuses } from 'root/@core/types/enum';
import { LikeDomainModel } from '../types';

export class Like implements LikeDomainModel {
  public login: string;

  public entityId: string;

  public likeStatus: LikeStatuses;

  public userId: string;

  constructor({ login, entityId, likeStatus, userId }: LikeDomainModel) {
    this.login = login;
    this.entityId = entityId;
    this.likeStatus = likeStatus;
    this.userId = userId;
  }
}
