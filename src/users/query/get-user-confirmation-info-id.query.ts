export const getUserConfirmationInfoIdQuery = `
    SELECT "confirmationInfo" FROM users WHERE users.id=$1 LIMIT 1
   `;
