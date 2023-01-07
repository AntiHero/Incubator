import { BannedUserForEntityDTO, BannedUserForEntityViewModel } from '../types';

export const convertToBannedUserForEntityViewModel = (
  bannedUser: BannedUserForEntityDTO,
): BannedUserForEntityViewModel => {
  return {
    id: bannedUser.userId,
    login: bannedUser.login,
    banInfo: {
      isBanned: bannedUser.isBanned,
      banDate: bannedUser.banDate,
      banReason: bannedUser.banReason,
    },
  };
};
