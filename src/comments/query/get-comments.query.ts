import { SortDirectionKeys } from 'root/@common/types/enum';

export const getCommentsByQuery = (
  sortBy: string,
  sortOrder: SortDirectionKeys,
  limit: number,
  offset: number,
) => `
  SELECT * FROM comments ORDER BY "${sortBy}" ${
  sortBy === 'createdAt' ? sortOrder : 'COLLATE "C" ' + sortOrder
}
    LIMIT ${limit} 
    OFFSET ${offset}
`;
