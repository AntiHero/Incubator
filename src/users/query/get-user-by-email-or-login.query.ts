export const getUserByLoginOrEmail = `
  SELECT u.id, u.login, u.email, u.role, u."createdAt", u.password, 
    ubi."banDate", ubi."isBanned", ubi."banReason",
    uci."isConfirmed", uci."code" AS "confirmationCode", 
    uci."expDate", pr."code" AS "passwordRecoveryCode"
    FROM users u
    JOIN users_confirmation_info uci ON uci."userId"=u."id"
    JOIN users_ban_info ubi ON ubi."userId"=u."id"
    JOIN password_recovery pr ON pr."userId"=u."id"
    WHERE (u.login ~* $1 OR u.email ~* $1)  
    LIMIT 1
`;
