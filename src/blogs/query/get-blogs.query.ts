import { SortDirectionKeys } from 'root/@core/types/enum';

export const getBlogsByQuery = (
  filter: string,
  sortBy: string,
  sortOrder: SortDirectionKeys,
  limit: number,
  offset: number,
) => `
SELECT b.*,
bi.type, bi.name as "imageName", bi.size, bi.width, bi.height, bi.url
FROM blogs b
INNER JOIN blog_images bi ON bi."blogId" = b.id
WHERE b.${filter}
ORDER BY b."${sortBy}" ${
  sortBy === 'createdAt' ? sortOrder : 'COLLATE "C" ' + sortOrder
}
  LIMIT ${limit}
  OFFSET ${offset}
`;
