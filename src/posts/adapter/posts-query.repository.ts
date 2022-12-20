import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Post } from '../entity/post.entity';
import { Roles } from 'root/users/types/roles';
import { PostExtendedLikesDTO } from '../types';
import { User } from 'root/users/models/user.model';
import { Blog } from 'root/blogs/entity/blog.entity';
import { LikeStatuses } from 'root/@common/types/enum';
import { PaginationQueryType } from 'root/@common/types';
import { countSkip } from 'root/@common/utils/count-skip';
import { getPostsByQuery } from '../query/get-posts.query';
import { ConvertPostData } from '../utils/convertPostData';
import { Comment } from 'root/comments/entity/comment.entity';
import { CommentExtendedLikesDTO } from 'root/comments/types';
import { ConvertLikeData } from 'root/likes/utils/convertLike';
import { CommentLike, PostLike } from 'root/likes/entity/like.entity';
import { ConvertCommentData } from 'root/comments/utils/convertComment';
import { getPostCommentsByQuery } from '../query/get-post-comments.query';
import { getLikesCount } from 'root/blogs/query/get-blog-post-likes-count.query';
import { getBlogPostLikesByQuery } from 'root/blogs/query/get-blog-post-likes.query';
import { getCommentLikesCount } from 'root/blogs/query/get-comment-likes-count.query';

@Injectable()
export class PostsQueryRepository {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Blog)
    private readonly blogsRepository: Repository<Blog>,
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
    @InjectRepository(Comment)
    private readonly commentsRepository: Repository<Comment>,
    @InjectRepository(PostLike)
    private readonly postLikesRepository: Repository<PostLike>,
    @InjectRepository(CommentLike)
    private readonly commentLikesRepository: Repository<CommentLike>,
  ) {}

  async getAllPosts() {
    const posts =
      (await this.postsRepository.query(
        `
          SELECT * FROM posts
        `,
      )) ?? [];

    return posts.map(ConvertPostData.toDTO);
  }

  async findPostById(postId: string) {
    const post = (
      await this.postsRepository.query(
        `
          SELECT * FROM posts WHERE id=$1 LIMIT 1
        `,
        [postId],
      )
    )[0];

    if (!post) return null;

    const blogName =
      (
        await this.blogsRepository.query(
          `
            SELECT name FROM blogs WHERE id=$1 LIMIT 1
          `,
          [post.blogId],
        )
      )[0]?.name ?? '';

    const postLikes = await this.postLikesRepository.query(
      `
        SELECT * FROM post_likes WHERE "entityId"=$1
      `,
      [postId],
    );

    const postComments = await this.commentsRepository.query(
      `
        SELECT * FROM comments WHERE "entityId"=$1
      `,
      [postId],
    );

    return {
      ...ConvertPostData.toDTO(post),
      blogName,
      likes: postLikes.map(ConvertLikeData.toDTO),
      comments: postComments.map(ConvertCommentData.toDTO),
    };
  }

  async countPosts() {
    const count = (
      await this.postsRepository.query(
        `
             SELECT COUNT(*) FROM posts
          `,
      )
    )[0]?.count;

    return Number(count);
  }

  async getExtendedPostInfo(id: string, userId: string, forRole?: Roles) {
    try {
      const post = (
        await this.postsRepository.query(
          `
            SELECT * FROM posts WHERE id=$1 LIMIT 1
          `,
          [id],
        )
      )[0];

      if (!post) return null;

      let blogName = '';

      if (forRole === Roles.USER) {
        const blog = (
          await this.blogsRepository.query(
            `
              SELECT * FROM blogs WHERE id=$1
            `,
            [post.blogId],
          )
        )[0];

        if (!blog) return null;

        blogName = blog.name;

        const banInfo = JSON.parse(blog.banInfo);

        if (banInfo.isBanned) {
          return null;
        }
      }

      const likesCount = (
        await this.postLikesRepository.query(
          `
              SELECT COUNT(*) from post_likes WHERE "entityId"=$1 AND "likeStatus"='Like'
            `,
          [id],
        )
      )[0]?.count;

      const dislikesCount = (
        await this.postLikesRepository.query(
          `
              SELECT COUNT(*) from post_likes WHERE "entityId"=$1 AND "likeStatus"='Dislike'
            `,
          [id],
        )
      )[0]?.count;

      let userStatus: LikeStatuses = LikeStatuses.None;

      if (userId) {
        userStatus =
          (
            await this.postLikesRepository.query(
              `
              SELECT "likeStatus" FROM post_likes WHERE "entityId"=$1 AND "userId"=$2
            `,
              [id, userId],
            )
          )[0]?.likeStatus ?? LikeStatuses.None;
      }

      const newestLikes = await this.postLikesRepository.query(
        getBlogPostLikesByQuery,
        [id],
      );

      const extendedPost: PostExtendedLikesDTO = {
        ...ConvertPostData.toDTO(post),
        blogName,
        likesCount: Number(likesCount),
        dislikesCount: Number(dislikesCount),
        userStatus,
        newestLikes: newestLikes.map(ConvertLikeData.toDTO),
      };

      return extendedPost;
    } catch (error) {
      console.error(error);

      return null;
    }
  }

  async getExtendedPostsInfoByQuery(
    query: PaginationQueryType,
    filter: any,
    userId: string,
  ): Promise<[PostExtendedLikesDTO[], number]> {
    try {
      const count = (
        await this.postsRepository.query(
          `
              SELECT COUNT(*) FROM posts 
            `,
        )
      )[0]?.count;

      const { sortBy, sortDirection, pageSize: limit } = query;
      const offset = countSkip(query.pageSize, query.pageNumber);

      const posts = await this.postsRepository.query(
        getPostsByQuery(sortBy, sortDirection, limit, offset),
      );

      if (!posts) return null;

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
                  SELECT "likeStatus" FROM post_likes 
                    WHERE "userId"=$1 AND "entityId"=$2
                `,
                [userId, post.id],
              )
            )[0]?.likeStatus ?? LikeStatuses.None;
        }

        const blogName =
          (
            await this.blogsRepository.query(
              `
                SELECT "name" FROM blogs WHERE id=$1
              `,
              [post.blogId],
            )
          )[0]?.name ?? '';

        result.push({
          ...ConvertPostData.toDTO(post),
          blogName,
          likesCount: Number(likesCount),
          dislikesCount: Number(dislikesCount),
          userStatus,
          newestLikes: likes.map(ConvertLikeData.toDTO),
        });
      }

      return [result, Number(count)];
    } catch (error) {
      console.error(error);

      return null;
    }
  }

  async findPostsByQuery(query: PaginationQueryType, filter: any = {}) {
    return null;
  }

  async deleteAllPosts() {
    await this.postsRepository.query(
      `
        DELETE FROM posts
      `,
    );
  }

  async findPostCommentsByQuery(
    id: string,
    query: PaginationQueryType,
    userId = '',
  ): Promise<[CommentExtendedLikesDTO[], number]> {
    try {
      const count = (
        await this.commentsRepository.query(
          `
              SELECT COUNT(*) FROM comments WHERE "entityId"=$1
            `,
          [id],
        )
      )[0]?.count;

      const { sortBy, sortDirection, pageSize: limit } = query;
      const offset = countSkip(query.pageSize, query.pageNumber);

      const comments =
        (await this.commentsRepository.query(
          getPostCommentsByQuery(sortBy, sortDirection, limit, offset),
          [id],
        )) ?? [];

      const result: CommentExtendedLikesDTO[] = [];

      for (const comment of comments) {
        const userLogin =
          (
            await this.usersRepository.query(
              `
                SELECT "login" AS "userLogin" FROM users WHERE id=$1 LIMIT 1
              `,
              [userId],
            )
          )[0]?.userLogin ?? '';

        const likesAndDislikesCount = (
          await this.commentLikesRepository.query(getCommentLikesCount, [
            comment.id,
          ])
        )[0];

        const likesCount = likesAndDislikesCount?.likesCount ?? 0;
        const dislikesCount = likesAndDislikesCount?.dislikesCount ?? 0;

        // if (likesAndDislikesCount) {
        //   likesCount = likesAndDislikesCount.likesCount;
        //   dislikesCount = likesAndDislikesCount.dislikesCount;
        // }

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
          likesCount: Number(likesCount),
          dislikesCount: Number(dislikesCount),
          userStatus,
          userLogin,
        });
      }

      return [result, count];
    } catch (error) {
      console.error(error);

      return null;
    }
  }
}

//   async addComment(
//     id: string,
//     data: Pick<CommentDTO, 'content' | 'userId' | 'userLogin'>,
//   ) {
//     const post = await this.model.findById(id).lean().exec();

//     if (!post) return null;

//     const { content, userId, userLogin } = data;

//     const comment = await this.commentModel.create({
//       userId,
//       entityId: id,
//       content,
//       userLogin,
//     });

//     await this.model.findByIdAndUpdate(id, {
//       $push: { comments: comment._id },
//     });

//     await comment.populate('likes');

//     return convertToCommentDTO(comment);
//   }
// }
