export const getBlogPostLikesByQuery = `SELECT post_likes.*, users.login
    FROM post_likes
    JOIN users ON users.id=post_likes."userId"
    WHERE "entityId"=$1 AND "likeStatus"='Like' AND post_likes."isBanned"=false
    ORDER BY "createdAt" DESC
    LIMIT 3
`;

// export const getBlogPostLikesByQuery = `SELECT post_likes.*, users.login
//     FROM post_likes
//     JOIN users ON users.id=post_likes."userId"
//     WHERE "entityId"=$1 AND "likeStatus"='Like'
//     AND "userId" IN (SELECT id FROM users WHERE "banInfo" IN (SELECT id FROM user_ban_info WHERE "isBanned"=false))
//     ORDER BY "createdAt" DESC
//     LIMIT 3
// `;
