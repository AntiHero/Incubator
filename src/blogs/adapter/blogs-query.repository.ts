import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Blog } from '../entity/blog.entity';
import { Roles } from 'root/users/types/roles';
import { BlogCommentType, BlogDTO } from '../types';
import { User } from 'root/users/entity/user.entity';
import { Post } from 'root/posts/entity/post.entity';
import { LikeStatuses } from 'root/@common/types/enum';
import { PostExtendedLikesDTO } from 'root/posts/types';
import { BloggerCommentDTO } from 'root/bloggers/types';
import { ConvertBlogData } from '../utils/convertToBlog';
import { PaginationQueryType } from 'root/@common/types';
import { countSkip } from 'root/@common/utils/count-skip';
import { getBlogsByQuery } from '../query/get-blogs.query';
import { Comment } from 'root/comments/entity/comment.entity';
import { ConvertLikeData } from 'root/likes/utils/convertLike';
import { ConvertPostData } from 'root/posts/utils/convertPostData';
import { getBlogPostsByQuery } from '../query/get-blog-posts.query';
import { CommentLike, PostLike } from 'root/likes/entity/like.entity';
import { ConvertCommentData } from 'root/comments/utils/convertComment';
import { getLikesCount } from '../query/get-blog-post-likes-count.query';
import { ConvertBloggerData } from 'root/bloggers/utils/convertBloggerData';
import { getBlogPostLikesByQuery } from '../query/get-blog-post-likes.query';
import { getCommentLikesCount } from '../query/get-comment-likes-count.query';
import { getBlogPostCommentsByQuery } from '../query/get-blog-post-comments.query';

@Injectable()
export class BlogsQueryRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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
      const count = (
        await this.commentRepository.query(
          `
          SELECT COUNT(*) FROM comments 
            WHERE "entityId" IN (SELECT "id" FROM posts 
            WHERE "blogId" IN (SELECT "id" FROM blogs WHERE "userId"=$1))
        `,
          [userId],
        )
      )[0]?.count;

      const { sortBy, sortDirection, pageSize: limit } = query;
      const offset = countSkip(query.pageSize, query.pageNumber);

      const comments = await this.commentLikesRepository.query(
        getBlogPostCommentsByQuery(sortBy, sortDirection, limit, offset),
        [userId],
      );

      const result: BlogCommentType[] = [];

      for (const comment of comments) {
        const blogData = (
          await this.blogsRepository.query(
            `
            SELECT id, "name"
              FROM (SELECT * FROM blogs WHERE id=(SELECT "blogId" FROM posts WHERE id=$1)) AS b
          `,
            [comment.entityId],
          )
        )[0];

        let blogName: string;
        let blogId: string;

        if (blogData) {
          blogName = blogData.name;
          blogId = blogData.id;
        }

        const postData = (
          await this.postRepository.query(
            `
              SELECT id, "title" FROM posts WHERE id=$1
            `,
            [comment.entityId],
          )
        )[0];

        console.log(postData);
        let title: string;
        let postId: string;

        if (postData) {
          title = postData.title;
          postId = postData.id;
        }

        const userLogin = (
          await this.userRepository.query(
            `
                SELECT "login" FROM users WHERE id=$1
              `,
            [comment.userId],
          )
        )[0]?.login;

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
          title,
          likesCount,
          dislikesCount,
          userStatus,
          postId,
          blogId,
          blogName,
          userLogin,
          userId: comment.userId,
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
