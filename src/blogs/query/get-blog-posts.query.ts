import { SortDirectionKeys } from 'root/@core/types/enum';

export const getBlogPostsByQuery = (
  sortBy: string,
  sortOrder: SortDirectionKeys,
  limit: number,
  offset: number,
) => `
    WITH posts AS (
    SELECT p.*, b.name "blogName" 
    FROM posts p
    LEFT JOIN blogs b ON p."blogId"=b.id
    WHERE b.id = $1
    ORDER BY "${sortBy}" ${
  sortBy === 'createdAt' ? sortOrder : 'COLLATE "C" ' + sortOrder
}
    LIMIT ${limit} 
    OFFSET ${offset}
  ), likes_info AS (
    SELECT p.id,
    COUNT(*) FILTER (WHERE pl."likeStatus" = 'Like') AS "likesCount",
    COUNT(*) FILTER (WHERE pl."likeStatus" = 'Dislike') AS "dislikesCount",
    CASE WHEN 
    (SELECT "likeStatus" FROM post_likes pl WHERE pl."entityId" = p.id AND pl."userId" = $2) in ('Like', 'Dislike') 
    THEN (SELECT "likeStatus" FROM post_likes pl WHERE pl."entityId" = p.id AND pl."userId" = $2)
    ELSE 'None' END as "userLikeStatus"
    FROM posts p
    LEFT JOIN post_likes pl ON pl."entityId" = p.id
    GROUP BY p.id
  ), images AS (
    SELECT p.id,
    JSON_AGG(pi.*) AS images
    FROM posts p
    LEFT JOIN post_images pi ON pi."postId" = p.id
    GROUP BY p.id
  ), likes AS (SELECT ltl."postId" AS id, JSON_AGG(ltl.*) as likes
	FROM (
		SELECT p.id AS "postId", pl.*, u.login,
		ROW_NUMBER() OVER (PARTITION BY p.id ORDER BY pl."createdAt" DESC) AS rn 
		FROM posts p 
		LEFT JOIN post_likes pl 
		ON pl."entityId" = p.id 
		LEFT JOIN users u
		ON u.id = pl."userId"
		WHERE pl."likeStatus" = 'Like') AS ltl 
	WHERE rn < 4 
	GROUP BY ltl."postId")	

  SELECT p.*, li."likesCount", li."dislikesCount", li."userLikeStatus", pi.images, l.likes 
  FROM posts p
  LEFT JOIN likes_info li
  ON li.id = p.id
  LEFT JOIN images pi
  ON pi.id = p.id
  LEFT JOIN likes l
  ON l.id = p.id
  ORDER BY "${sortBy}" ${
  sortBy === 'createdAt' ? sortOrder : 'COLLATE "C" ' + sortOrder
}
  `;

//`;
//   SELECT p.*
//     FROM posts p
//     WHERE p."blogId"=$1
//     ORDER BY "${sortBy}" ${
//   sortBy === 'createdAt' ? sortOrder : 'COLLATE "C" ' + sortOrder
// }
//     LIMIT ${limit}
//     OFFSET ${offset}
