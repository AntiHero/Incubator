export const getLikesCount = `
  SELECT COUNT(*) AS "likesCount", 
    (SELECT COUNT(*) AS "dislikesCount" FROM post_likes
    WHERE "likeStatus"='Dislike' AND "entityId"=$1 AND "isBanned"=false) 
    FROM post_likes WHERE "likeStatus"='Like' AND "entityId"=$1 
    AND "isBanned"=false
`;

// export const getLikesCount = `
//   SELECT COUNT(*) AS "likesCount",
//     (SELECT COUNT(*) AS "dislikesCount" FROM post_likes
//     WHERE "likeStatus"='Dislike' AND "entityId"=$1
//     AND "userId" IN (SELECT id FROM users WHERE "banInfo" IN (SELECT id FROM user_ban_info WHERE "isBanned"=false)))
//     FROM post_likes WHERE "likeStatus"='Like' AND "entityId"=$1
//     AND "userId" IN (SELECT id FROM users WHERE "banInfo" IN (SELECT id FROM user_ban_info WHERE "isBanned"=false))
// `;
