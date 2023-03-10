import { SortDirectionKeys } from 'root/@core/types/enum';

export const getBlogsByQuery = (
  filter: string,
  sortBy: string,
  sortOrder: SortDirectionKeys,
  limit: number,
  offset: number,
) => `
  SELECT b.*, CAST("banInfo" AS json) AS "banInfo", JSON_AGG(json_build_object('fileSize', bi.size, 'url', bi.url, 'type', bi.type, 'width', bi.width, 'height', bi.height)) as images
  FROM blogs b
  INNER JOIN blog_images bi ON bi."blogId" = b.id
  WHERE b.${filter}
  GROUP BY b.id
  ORDER BY b."${sortBy}" ${
  sortBy === 'createdAt' ? sortOrder : 'COLLATE "C" ' + sortOrder
}
  LIMIT ${limit}
  OFFSET ${offset}
`;
