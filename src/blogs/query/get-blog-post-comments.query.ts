import { SortDirectionKeys } from 'root/@common/types/enum';

export const getBlogPostCommentsByQuery = (
  sortBy: string,
  sortOrder: SortDirectionKeys,
  limit: number,
  offset: number,
) => `
    SELECT * FROM (SELECT comments.*, posts.id AS "postId", posts.title, 
    users.login, users.id AS "userId", blogs.id AS "blogId",
    blogs."name" AS "blogName"
    FROM comments 
    JOIN posts ON posts.id=comments."entityId"
    JOIN users ON users.id=comments."userId"
    JOIN blogs ON blogs.id=posts."blogId"
    WHERE "entityId" IN (SELECT "id" FROM posts 
    WHERE "blogId" IN (SELECT "id" FROM blogs WHERE "userId"=$1))) AS c
    ORDER BY "${sortBy}" ${
  sortBy === 'createdAt' ? sortOrder : 'COLLATE "C" ' + sortOrder
}
    LIMIT ${limit} 
    OFFSET ${offset}
`;

// export const getBlogPostCommentsByQuery = (
//   sortBy: string,
//   sortOrder: SortDirectionKeys,
//   limit: number,
//   offset: number,
// ) => `
//   SELECT * FROM comments
//     WHERE "entityId" IN (SELECT "id" FROM posts
//     WHERE "blogId" IN (SELECT "id" FROM blogs WHERE "userId"=$1))
//     ORDER BY "${sortBy}" ${
//   sortBy === 'createdAt' ? sortOrder : 'COLLATE "C" ' + sortOrder
// }
//     LIMIT ${limit}
//     OFFSET ${offset}
// `;
// JOIN blogs ON blogs.id=(SELECT "blogId" FROM posts
//     WHERE posts.id IN (SELECT "entityId" FROM comments WHERE comments."userId"=$1))
