export const getLikesCount = `
  SELECT COUNT(*) AS "likesCount", 
    (SELECT COUNT(*) AS "dislikesCount" FROM comment_likes
    WHERE "likeStatus"='Dislike' AND "entityId"=$1)
    FROM comment_likes WHERE "likeStatus"='Like' AND "entityId"=$1
`;
