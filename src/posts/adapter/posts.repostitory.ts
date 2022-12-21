import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Post } from '../entity/post.entity';
import { Blog } from 'root/blogs/entity/blog.entity';
import { Comment } from 'root/comments/entity/comment.entity';
import { CommentLike, PostLike } from 'root/likes/entity/like.entity';
import { PostDomainModel, PostExtendedLikesDTO } from '../types';
import { ConvertPostData } from '../utils/convertPostData';
import { LikeStatuses } from 'root/@common/types/enum';
import { updatePostQuery } from '../query/update-post.query';
import { LikeDomainModel } from 'root/likes/types';
import { CommentDTO } from 'root/comments/types';
import { User } from 'root/users/entity/user.entity';
import { ConvertCommentData } from 'root/comments/utils/convertComment';
import { updatePostLikeQuery } from '../query/update-post-like.query';

@Injectable()
export class PostsRepository {
  constructor(
    @InjectRepository(Blog)
    private readonly blogsRepository: Repository<Blog>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
    @InjectRepository(Comment)
    private readonly commentsRepository: Repository<Comment>,
    @InjectRepository(PostLike)
    private readonly postLikesRepository: Repository<PostLike>,
  ) {}

  async addPost(post: Partial<PostDomainModel>) {
    try {
      const blog = (
        await this.blogsRepository.query(
          `
        SELECT id, name FROM blogs WHERE id=$1 LIMIT 1
      `,
          [post.blogId],
        )
      )[0];

      if (!blog) return null;

      const { title, shortDescription, blogId, content } = post;

      const createdPost = (
        await this.postLikesRepository.query(
          `
          INSERT INTO posts ("title", "shortDescription", "blogId", "content") 
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `,
          [title, shortDescription, blogId, content],
        )
      )[0];

      const postDTO = ConvertPostData.toDTO(createdPost);

      const extendedPost: PostExtendedLikesDTO = {
        ...postDTO,
        likesCount: 0,
        dislikesCount: 0,
        userStatus: LikeStatuses.None,
        newestLikes: [],
      };

      return extendedPost;
    } catch (error) {
      console.error(error);

      return null;
    }
  }

  async findPostByIdAndUpdate(id: string, updates: Partial<PostDomainModel>) {
    try {
      const post = (
        await this.postsRepository.query(updatePostQuery(updates), [id])
      )[0][0];

      return ConvertPostData.toDTO(post);
    } catch (error) {
      console.error(error);

      return null;
    }
  }

  async findPostByIdAndDelete(id: string) {
    try {
      const post = (
        await this.postsRepository.query(
          `
          DELETE FROM posts WHERE posts.id=$1 RETURNING *
        `,
          [id],
        )
      )[0][0];

      if (!post) return null;

      return ConvertPostData.toDTO(post);
    } catch (e) {
      console.error(e);

      return null;
    }
  }

  async likePost(
    id: string,
    likeData: Partial<LikeDomainModel>,
    userId: string,
  ) {
    try {
      const existingLike = (
        await this.postLikesRepository.query(
          `
          SELECT * FROM post_likes WHERE "entityId"=$1 AND "userId"=$2
        `,
          [id, userId],
        )
      )[0];

      if (!existingLike && likeData.likeStatus === LikeStatuses.None) {
        return true;
      }

      if (!existingLike) {
        await this.postLikesRepository.query(
          `
          INSERT INTO post_likes ("entityId", "userId", "likeStatus", "isBanned")
            VALUES ($1, $2, $3, DEFAULT)
        `,
          [id, userId, likeData.likeStatus],
        );

        return true;
      }

      if (likeData.likeStatus === LikeStatuses.None) {
        await this.postLikesRepository.query(
          `
            DELETE FROM post_likes WHERE id=$1
          `,
          [existingLike.id],
        );

        return true;
      }

      if (existingLike.likeStatus === likeData.likeStatus) {
        return true;
      }

      await this.postLikesRepository.query(updatePostLikeQuery(likeData), [
        existingLike.id,
      ]);

      return true;
    } catch (error) {
      console.error(error);

      return null;
    }
  }

  async addComment(
    id: string,
    comment: Pick<CommentDTO, 'content' | 'userId'>,
  ): Promise<CommentDTO> {
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

      const { content, userId } = comment;

      const userLogin =
        (
          await this.usersRepository.query(
            `
              SELECT "login" FROM users WHERE id=$1 
            `,
            [userId],
          )
        )[0]?.login ?? '';

      const createdComment = (
        await this.commentsRepository.query(
          `
          INSERT INTO comments ("content", "userId", "entityId", "isBanned") 
            VALUES ($1, $2, $3, DEFAULT) RETURNING *
        `,
          [content, userId, id],
        )
      )[0];

      return {
        ...ConvertCommentData.toDTO(createdComment),
        userLogin,
        likes: [],
      };
    } catch (error) {
      console.error(error);

      return null;
    }
  }
}
