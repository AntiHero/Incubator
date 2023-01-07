import { SortDirectionKeys } from 'root/@common/types/enum';

export const getPostsByQuery = (
  sortBy: string,
  sortOrder: SortDirectionKeys,
  limit: number,
  offset: number,
) => `
  SELECT * FROM (SELECT posts.*, blogs.name AS "blogName" 
  FROM posts JOIN blogs ON posts."blogId"=blogs.id) AS bp
  ORDER BY "${sortBy}" ${
  sortBy === 'createdAt' ? sortOrder : 'COLLATE "C" ' + sortOrder
}
    LIMIT ${limit} 
    OFFSET ${offset}
`;
