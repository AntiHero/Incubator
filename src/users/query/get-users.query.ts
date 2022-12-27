import { SortDirectionKeys } from 'root/@common/types/enum';

export const getUsersByQuery = (
  searchLoginTerm: string,
  searchEmailTerm: string,
  sortBy: string,
  sortOrder: SortDirectionKeys,
  limit: number,
  isBanned: boolean | undefined,
  offset: number,
) => `
  SELECT u.id, u.login, u.email, u.role, u."createdAt", 
    ubi."banDate", ubi."isBanned", ubi."banReason",
    uci."isConfirmed", uci."code" AS "confirmationCode", 
    uci."expDate", pr."code" AS "passwordRecoveryCode"
    FROM users u
    JOIN user_ban_info ubi ON u."banInfo"=ubi.id
    JOIN user_confirmation_info uci ON u."confirmationInfo"=uci.id
    JOIN password_recovery pr ON u."passwordRecovery"=pr.id
    WHERE (u.login ~* '${searchLoginTerm}' OR u.email ~* '${searchEmailTerm}') 
    AND ubi."isBanned"=${isBanned === undefined ? `ubi."isBanned"` : isBanned} 
    ORDER BY "${sortBy}" ${
  sortBy === 'createdAt' ? sortOrder : 'COLLATE "C" ' + sortOrder
}
    LIMIT ${limit} 
    OFFSET ${offset}
`;

//   SELECT users.id, users.login, users.email, users.role, users."createdAt",
//     user_ban_info."banDate", user_ban_info."isBanned", user_ban_info."banReason",
//     user_confirmation_info."isConfirmed", user_confirmation_info."code" AS "confirmationCode",
//     user_confirmation_info."expDate", password_recovery."code" AS "passwordRecoveryCode"
//     FROM users, user_ban_info, user_confirmation_info, password_recovery
//     WHERE (users.login ~* '${searchLoginTerm}' OR users.email ~* '${searchEmailTerm}')
//     AND users."banInfo"=user_ban_info.id
//     AND users."passwordRecovery"=password_recovery.id
//     AND users."confirmationInfo"=user_confirmation_info.id
//     AND user_ban_info."isBanned"=${isBanned === undefined ? `ubi."isBanned"` : isBanned}
//     ORDER BY "${sortBy}" ${
//   sortBy === 'createdAt' ? sortOrder : 'COLLATE "C" ' + sortOrder
// }
//     LIMIT ${limit}
//     OFFSET ${offset}
// `;
