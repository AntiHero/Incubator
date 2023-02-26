import { BannedUserForEntityDTO } from '../types';
import { BannedUser } from 'root/bloggers/infrastructure/database/entities/banned-user.entity';

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
