import { SortDirectionKeys } from 'root/@common/types/enum';

export const getBlogPostCommentsByQuery = (
  sortBy: string,
  sortOrder: SortDirectionKeys,
  limit: number,
  offset: number,
) => `
  SELECT * FROM post_comments 
    WHERE "entityId"=(SELECT "id" FROM posts 
    WHERE "blogId"=(SELECT "id" FROM blogs WHERE "userId"=$1))
    ORDER BY "${sortBy}" ${
  sortBy === 'createdAt' ? sortOrder : 'COLLATE "C" ' + sortOrder
}
    LIMIT ${limit} 
    OFFSET ${offset}
`;
