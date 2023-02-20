import { SortDirectionKeys } from 'root/@core/types/enum';

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
    JOIN users_ban_info ubi ON u."id"=ubi."userId"
    JOIN users_confirmation_info uci ON u."id"=uci."userId"
    JOIN password_recovery pr ON u."id"=pr."userId"
    WHERE (u.login ~* '${searchLoginTerm}' OR u.email ~* '${searchEmailTerm}') 
    AND ubi."isBanned"=${isBanned === undefined ? `ubi."isBanned"` : isBanned} 
    ORDER BY "${sortBy}" ${
  sortBy === 'createdAt' ? sortOrder : 'COLLATE "C" ' + sortOrder
}
    LIMIT ${limit} 
    OFFSET ${offset}
`;
