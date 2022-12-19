export const getBlogPostLikesByQuery = `SELECT * FROM "post_likes" 
    WHERE "entityId"=$1 AND "likeStatus"='Like'
    ORDER BY "createdAt" DESC
    LIMIT 3
`;
