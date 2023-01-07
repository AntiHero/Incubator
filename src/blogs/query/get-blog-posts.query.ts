import { SortDirectionKeys } from 'root/@common/types/enum';

export const getBlogPostsByQuery = (
  sortBy: string,
  sortOrder: SortDirectionKeys,
  limit: number,
  offset: number,
) => `
  SELECT * FROM posts 
    WHERE posts."blogId"=$1
    ORDER BY "${sortBy}" ${
  sortBy === 'createdAt' ? sortOrder : 'COLLATE "C" ' + sortOrder
}
    LIMIT ${limit} 
    OFFSET ${offset}
`;
