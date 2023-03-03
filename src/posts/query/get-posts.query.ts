import { SortDirectionKeys } from 'root/@core/types/enum';

export const getPostsByQuery = (
  sortBy: string,
  sortOrder: SortDirectionKeys,
  limit: number,
  offset: number,
) => `
  SELECT p.*, b.name AS "blogName", pi.size, pi.width, pi.height, pi.url
  FROM posts p 
  LEFT JOIN blogs b ON p."blogId"=b.id
  LEFT JOIN post_images pi ON pi."postId"=p.id
  ORDER BY "${sortBy}" ${
  sortBy === 'createdAt' ? sortOrder : 'COLLATE "C" ' + sortOrder
}
  LIMIT ${limit} 
  OFFSET ${offset}
`;
