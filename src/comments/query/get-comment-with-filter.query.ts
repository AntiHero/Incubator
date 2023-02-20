import { SortDirectionKeys } from 'root/@core/types/enum';

export const getCommentsWithFilterByQuery = (
  filter: string,
  sortBy: string,
  sortOrder: SortDirectionKeys,
  limit: number,
  offset: number,
) => `
  SELECT * FROM comments WHERE ${filter}
    ORDER BY "${sortBy}" ${
  sortBy === 'createdAt' ? sortOrder : 'COLLATE "C" ' + sortOrder
}
    LIMIT ${limit} 
    OFFSET ${offset}
`;
