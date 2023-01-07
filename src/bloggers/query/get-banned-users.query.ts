import { SortDirectionKeys } from 'root/@common/types/enum';

export const getBannedUsersByQuery = (
  searchLoginTerm: string,
  sortBy: string,
  sortOrder: SortDirectionKeys,
  limit: number,
  offset: number,
) => `
  SELECT users.id, users.login, banned_users."banReason", banned_users."entityId",
    banned_users."banDate", banned_users."isBanned", banned_users."userId"
    FROM users
    JOIN banned_users ON users.id=banned_users."userId"
    WHERE (users.login ~* '${searchLoginTerm}' 
      AND users.id IN (SELECT "userId" 
      FROM banned_users WHERE "entityId"=$1))  
    ORDER BY "${sortBy}" ${
  sortBy === 'createdAt' ? sortOrder : 'COLLATE "C" ' + sortOrder
}
    LIMIT ${limit} 
    OFFSET ${offset}
`;
