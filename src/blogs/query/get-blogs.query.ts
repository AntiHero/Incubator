import { SortDirectionKeys } from 'root/@common/types/enum';

export const getBlogsByQuery = (
  filter: string,
  sortBy: string,
  sortOrder: SortDirectionKeys,
  limit: number,
  offset: number,
) => `
  SELECT * FROM blogs WHERE ${filter}
    ORDER BY "${sortBy}" ${
  sortBy === 'createdAt' ? sortOrder : 'COLLATE "C" ' + sortOrder
}
    LIMIT ${limit} 
    OFFSET ${offset}
`;
