import { BannedUser } from '../entity/banned-user.entity';
import { BannedUserForEntityDTO } from '../types';

export class ConvertBannedUserData {
  static toDTO(
    bannedUser: BannedUser & { login: string },
  ): BannedUserForEntityDTO {
    return {
      id: String(bannedUser.id),
      login: bannedUser.login,
      banDate: bannedUser.banDate.toISOString(),
      isBanned: bannedUser.isBanned,
      userId: String(bannedUser.userId),
      banReason: bannedUser.banReason,
      entityId: String(bannedUser.entityId),
    };
  }
}
