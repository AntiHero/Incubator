import { Repository } from 'typeorm';
import { BlogDomainModel } from '../types';
import { Injectable } from '@nestjs/common';
import { Blog } from '../entity/blog.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from 'root/posts/entity/post.entity';
import { LikeStatuses } from 'root/@common/types/enum';
import { ConvertBlogData } from '../utils/convertToBlog';
import { updateBlogQuery } from '../query/update-blog.query';
import { ConvertPostData } from 'root/posts/utils/convertPostData';
import { PostDomainModel, PostExtendedLikesDTO } from 'root/posts/types';

@Injectable()
export class BlogsRepository {
  constructor(
    @InjectRepository(Blog)
    private readonly blogsRepository: Repository<Blog>,
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async addBlog(blog: Partial<BlogDomainModel>) {
    try {
      const { name, description, websiteUrl, userId } = blog;

      const createdBlog = (
        await this.blogsRepository.query(
          `
          INSERT INTO blogs ("name", "description", "websiteUrl", "userId", "banInfo") 
            VALUES ($1, $2, $3, $4, DEFAULT)
            RETURNING *
        `,
          [name, description, websiteUrl, userId],
        )
      )[0];

      const banInfo = JSON.parse(createdBlog.banInfo);

      return ConvertBlogData.toDTO({ ...createdBlog, banInfo });
    } catch (error) {
      console.error(error);

      return null;
    }
  }

  async findBlogByIdAndUpdate(id: string, updates: Partial<BlogDomainModel>) {
    try {
      const blog = (
        await this.blogsRepository.query(updateBlogQuery(updates), [id])
      )[0][0];

      if (!blog) return null;

      const banInfo = JSON.parse(blog.banInfo);

      return ConvertBlogData.toDTO({ ...blog, banInfo });
    } catch (e) {
      console.error(e);

      return null;
    }
  }

  async findBlogByIdAndDelete(id: string) {
    try {
      const blog = (
        await this.blogsRepository.query(
          `
          DELETE FROM blogs WHERE blogs.id=$1 RETURNING *
        `,
          [id],
        )
      )[0][0];

      if (!blog) return null;

      const banInfo = JSON.parse(blog.banInfo);

      return ConvertBlogData.toDTO({ ...blog, banInfo });
    } catch (e) {
      console.error(e);

      return null;
    }
  }

  async deleteAllBlogs() {
    await this.blogsRepository.query(
      `
        DELETE FROM blogs
      `,
    );
  }

  async addBlogPost(id: string, post: Partial<PostDomainModel>) {
    try {
      const { title, shortDescription, content } = post;

      const createdPost = (
        await this.postRepository.query(
          `
        INSERT INTO posts ("title", "shortDescription", "content", "blogId") 
          VALUES ($1, $2, $3, $4)
          RETURNING *
      `,
          [title, shortDescription, content, id],
        )
      )[0];

      const convertedPost = ConvertPostData.toDTO(createdPost);

      const blogName =
        (
          await this.blogsRepository.query(
            `
          SELECT "name" FROM blogs WHERE id=$1
        `,
            [id],
          )
        )[0]?.name ?? '';

      const extendedPost: PostExtendedLikesDTO = {
        ...convertedPost,
        blogName,
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

  async banBlog(id: string, banStatus: boolean) {
    try {
      let bannedBlog: any;

      if (banStatus) {
        bannedBlog = (
          await this.blogsRepository.query(
            `
            UPDATE blogs SET "banInfo"="banInfo"::jsonb 
              || '{"isBanned": ${banStatus}, "banDate": "${new Date().toISOString()}"}'
              WHERE id=$1 RETURNING *
          `,
            [id],
          )
        )[0][0];
      } else {
        bannedBlog = (
          await this.blogsRepository.query(
            `
            UPDATE blogs SET "banInfo"="banInfo"::jsonb 
              || '{"isBanned": ${banStatus}, "banDate": null}'
              WHERE id=$1 RETURNING *
          `,
            [id],
          )
        )[0][0];
      }

      if (!bannedBlog) return null;

      const banInfo = JSON.parse(bannedBlog.banInfo);

      return ConvertBlogData.toDTO({ ...bannedBlog, banInfo });
    } catch (error) {
      console.error(error);

      return null;
    }
  }
}
