export const getUserConfirmationInfoIdQuery = `
    SELECT "id" FROM users_confirmation_info uci WHERE uci."userId"=$1 LIMIT 1
   `;
