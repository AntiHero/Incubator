import { SortDirectionKeys } from 'root/@common/types/enum';

export const getUsersByQuery = (
  searchLoginTerm: string,
  searchEmailTerm: string,
  sortBy: string,
  sortOrder: SortDirectionKeys,
  limit: number,
  offset: number,
) => `
  SELECT users.id, users.login, users.email, users.role, users."createdAt", 
    user_ban_info."banDate", user_ban_info."isBanned", user_ban_info."banReason",
    user_confirmation_info."isConfirmed", user_confirmation_info."code" AS "confirmationCode", 
    user_confirmation_info."expDate", password_recovery."code" AS "passwordRecoveryCode"
    FROM users, user_ban_info, user_confirmation_info, password_recovery 
    WHERE (users.login ~* '${searchLoginTerm}' OR users.email ~* '${searchEmailTerm}')  
    AND users."banInfo"=user_ban_info.id
    AND users."passwordRecovery"=password_recovery.id
    AND users."confirmationInfo"=user_confirmation_info.id
    ORDER BY "${sortBy}" ${sortOrder} 
    LIMIT ${limit}
    OFFSET ${offset}
`;
// ORDER BY CASE WHEN $3 = 'asc' THEN '%%' || $2 || '%%' END ASC,
// CASE WHEN $3 = 'desc' THEN 'cratedAt' END DESC

// ORDER BY (CASE WHEN $2 = 'asc' THEN "createdAt" END) ASC,
//     (CASE WHEN $2 = 'desc' THEN "createdAt" END) DESC
