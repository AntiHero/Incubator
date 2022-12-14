export const getUserByIdQuery = `
  SELECT users.id, users.login, users.email, users.role, users."createdAt", 
    user_ban_info."banDate", user_ban_info."isBanned", user_ban_info."banReason",
    user_confirmation_info."isConfirmed", user_confirmation_info."code" AS "confirmationCode", 
    user_confirmation_info."expDate", password_recovery."code" AS "passwordRecoveryCode"
    FROM users, user_ban_info, user_confirmation_info, password_recovery 
    WHERE users.id=$1
    AND users."banInfo"=user_ban_info.id
    AND users."passwordRecovery"=password_recovery.id
    AND users."confirmationInfo"=user_confirmation_info.id
    LIMIT 1
`;
