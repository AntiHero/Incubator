import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import type {
  BlogCommentType,
  BlogDTO,
  BlogsWithImagesQueryResult,
  GroupedBlogsWithImages,
} from '../types';

import { Blog } from '../entity/blog.entity';
import { Roles } from 'root/users/types/roles';
import { Post } from 'root/posts/entity/post.entity';
import { PaginationQueryType } from 'root/@core/types';
import { PostExtendedLikesDTO } from 'root/posts/types';
import { ConvertBlogData } from '../utils/convertToBlog';
import { countSkip } from 'root/@core/utils/count-skip';
import { getBlogsByQuery } from '../query/get-blogs.query';
import { Comment } from 'root/comments/entity/comment.entity';
import { ImageType, LikeStatuses } from 'root/@core/types/enum';
import { ConvertLikeData } from 'root/likes/utils/convertLike';
import { BloggerCommentDTO } from 'root/bloggers/@common/types';
import { ConvertPostData } from 'root/posts/utils/convertPostData';
import { getBlogPostsByQuery } from '../query/get-blog-posts.query';
import { CommentLike, PostLike } from 'root/likes/entity/like.entity';
import { ConvertCommentData } from 'root/comments/utils/convertComment';
import { getLikesCount } from '../query/get-blog-post-likes-count.query';
import { getBlogPostLikesByQuery } from '../query/get-blog-post-likes.query';
import { getCommentLikesCount } from '../query/get-comment-likes-count.query';
import { getBlogPostCommentsByQuery } from '../query/get-blog-post-comments.query';
import { ConvertBloggerData } from 'root/bloggers/@common/utils/convertBloggerData';

@Injectable()
export class BlogsQueryRepository {
  constructor(
    @InjectRepository(Blog)
    private readonly blogsRepository: Repository<Blog>,
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(PostLike)
    private readonly postLikesRepository: Repository<PostLike>,
    @InjectRepository(CommentLike)
    private readonly commentLikesRepository: Repository<CommentLike>,
  ) {}

  async getAllBlogs() {
    try {
      const blogs = await this.blogsRepository.query(`
        SELECT * FROM blogs
      `);

      return blogs.map(ConvertBlogData.toDTO);
    } catch (error) {
      console.error(error);

      return null;
    }
  }

  async findBlogById(id: string, forUser?: Roles) {
    try {
      const blog = (
        await this.blogsRepository.query(
          `
            SELECT * FROM blogs WHERE blogs.id=$1 LIMIT 1
         `,
          [id],
        )
      )[0];

      if (!blog) return null;

      const banInfo = JSON.parse(blog.banInfo);

      if (forUser === Roles.USER) {
        if (banInfo.isBanned) return null;
      }

      return ConvertBlogData.toDTO({ ...blog, banInfo });
    } catch (error) {
      console.error(error);

      return null;
    }
  }

  async countBlogPosts(id: string) {
    const count = (
      await this.postRepository.query(
        `
        SELECT COUNT(*) FROM posts WHERE "blogId"=$1
      `,
        [id],
      )
    )[0]?.count;

    return Number(count);
  }

  async findBlogPostsByQuery(
    id: string,
    query: PaginationQueryType,
    userId = '',
  ): Promise<[PostExtendedLikesDTO[], number]> {
    try {
      const count = await this.countBlogPosts(id);

      const { sortBy, sortDirection, pageSize: limit } = query;
      const offset = countSkip(query.pageSize, query.pageNumber);

      const posts = await this.postRepository.query(
        getBlogPostsByQuery(sortBy, sortDirection, limit, offset),
        [id],
      );

      if (!posts) return null;

      const blogName =
        (
          await this.blogsRepository.query(
            `
              SELECT "name" FROM blogs WHERE id=$1
          `,
            [id],
          )
        )[0]?.name ?? '';

      const result: PostExtendedLikesDTO[] = [];

      for (const post of posts) {
        const likes = await this.postLikesRepository.query(
          getBlogPostLikesByQuery,
          [post.id],
        );
        const likesAndDislikesCount = (
          await this.postLikesRepository.query(getLikesCount, [post.id])
        )[0];

        let likesCount = 0;
        let dislikesCount = 0;

        if (likesAndDislikesCount) {
          likesCount = Number(likesAndDislikesCount.likesCount);
          dislikesCount = Number(likesAndDislikesCount.dislikesCount);
        }

        let userStatus: LikeStatuses = LikeStatuses.None;

        if (userId) {
          userStatus =
            (
              await this.postLikesRepository.query(
                `
                  SELECT "likeStatus" FROM post_likes WHERE "userId"=$1 AND "entityId"=$2
                `,
                [userId, post.id],
              )
            )[0]?.likeStatus ?? LikeStatuses.None;
        }

        result.push({
          ...ConvertPostData.toDTO(post),
          blogName,
          likesCount,
          dislikesCount,
          userStatus,
          newestLikes: likes.map(ConvertLikeData.toDTO),
        });
      }

      return [result, count];
    } catch (error) {
      console.error(error);

      return null;
    }
  }

  async findBlogsByQuery(
    query: PaginationQueryType,
    forRole?: Roles,
  ): Promise<[BlogDTO[], number]> {
    try {
      let filter = `name ~* '${query.searchNameTerm}'`;

      if (forRole === Roles.USER) {
        filter += ' AND ("banInfo"::jsonb->>\'isBanned\')::boolean is false';
      }

      const count = (
        await this.blogsRepository.query(
          `
          SELECT COUNT(*) FROM blogs WHERE ${filter}
        `,
        )
      )[0]?.count;

      const { sortBy, sortDirection, pageSize: limit } = query;
      const offset = countSkip(query.pageSize, query.pageNumber);

      const blogs: BlogsWithImagesQueryResult[] =
        await this.blogsRepository.query(
          getBlogsByQuery(filter, sortBy, sortDirection, limit, offset),
        );

      // refactor
      if (!blogs) return null;

      const groupedBlogs: GroupedBlogsWithImages[] = [];

      blogs.forEach((blog) => {
        const index = groupedBlogs.findIndex((b) => blog.id === b.id);

        const image = {
          url: blog.url,
          fileSize: blog.size,
          height: blog.height,
          width: blog.width,
        };

        if (index !== -1) {
          if (blog.type === ImageType.wallpaper) {
            groupedBlogs[index].images.wallpaper = image;
          } else {
            groupedBlogs[index].images.main.push(image);
          }
        } else {
          groupedBlogs.push({
            id: blog.id,
            name: blog.name,
            description: blog.description,
            userId: blog.userId,
            banInfo: JSON.parse(blog.banInfo),
            websiteUrl: blog.websiteUrl,
            createdAt: blog.createdAt,
            isMembership: blog.isMembership,
            images: {
              wallpaper: blog.type === ImageType.wallpaper ? image : null,
              main: blog.type === ImageType.main ? [image] : [],
            },
          });
        }
      });

      return [groupedBlogs.map(ConvertBlogData.withImagesToDTO), Number(count)];
    } catch (error) {
      console.error(error);

      return null;
    }
  }

  async findUserBlogsByQuery(userId: string, query: PaginationQueryType) {
    if (!userId) return [[], 0];

    const filter = `name ~* '${query.searchNameTerm}' AND "userId"=${userId}`;

    const count = (
      await this.blogsRepository.query(
        `
        SELECT COUNT(*) FROM blogs WHERE ${filter}
      `,
      )
    )[0]?.count;

    const { sortBy, sortDirection, pageSize: limit } = query;
    const offset = countSkip(query.pageSize, query.pageNumber);

    const blogs = await this.blogsRepository.query(
      getBlogsByQuery(filter, sortBy, sortDirection, limit, offset),
    );

    if (!blogs) return null;

    return [
      blogs.map((blog) => {
        const banInfo = JSON.parse(blog.banInfo);

        return ConvertBlogData.toDTO({ ...blog, banInfo });
      }),
      Number(count),
    ];
  }

  async getAllComments(
    userId: string,
    query: PaginationQueryType,
  ): Promise<[BloggerCommentDTO[], number]> {
    try {
      const count =
        (
          await this.commentRepository.query(
            `
          SELECT COUNT(*) FROM comments 
            WHERE "entityId" IN (SELECT "id" FROM posts 
            WHERE "blogId" IN (SELECT "id" FROM blogs WHERE "userId"=$1))
        `,
            [userId],
          )
        )[0]?.count ?? 0;

      if (!count) return [[], 0];

      const { sortBy, sortDirection, pageSize: limit } = query;
      const offset = countSkip(query.pageSize, query.pageNumber);

      const comments = await this.commentLikesRepository.query(
        getBlogPostCommentsByQuery(sortBy, sortDirection, limit, offset),
        [userId],
      );

      const result: BlogCommentType[] = [];

      for (const comment of comments) {
        const likesAndDislikesCount = (
          await this.commentLikesRepository.query(getCommentLikesCount, [
            comment.id,
          ])
        )[0];

        let likesCount = 0;
        let dislikesCount = 0;

        if (likesAndDislikesCount) {
          likesCount = Number(likesAndDislikesCount.likesCount);
          dislikesCount = Number(likesAndDislikesCount.dislikesCount);
        }

        let userStatus: LikeStatuses;

        if (userId) {
          userStatus =
            (
              await this.postLikesRepository.query(
                `
                  SELECT "likeStatus" FROM comment_likes WHERE "userId"=$1 AND "entityId"=$2
                `,
                [userId, comment.id],
              )
            )[0]?.likeStatus ?? LikeStatuses.None;
        }

        result.push({
          ...ConvertCommentData.toDTO(comment),
          title: comment.title,
          likesCount,
          dislikesCount,
          userStatus,
          postId: String(comment.postId),
          blogId: String(comment.blogId),
          blogName: comment.blogName,
          userLogin: comment.login,
          userId: String(comment.userId),
        });
      }

      return [
        result.map(ConvertBloggerData.toBloggerCommentDTO),
        Number(count),
      ];
    } catch (error) {
      console.error(error);

      return null;
    }
  }
}
