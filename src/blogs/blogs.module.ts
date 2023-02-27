import { Module } from '@nestjs/common';

import { Blog } from './entity/blog.entity';
import { BlogsService } from './services/blogs.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogsController } from './blogs.controller';
import { Post } from 'root/posts/entity/post.entity';
import { User } from 'root/users/entity/user.entity';
import { BlogsRepository } from './adapter/blogs.repository';
import { Comment } from 'root/comments/entity/comment.entity';
import { CommentLike, PostLike } from 'root/likes/entity/like.entity';
import { BlogsQueryRepository } from './adapter/blogs-query.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Blog,
      Post,
      User,
      Comment,
      PostLike,
      CommentLike,
    ]),
  ],
  controllers: [BlogsController],
  providers: [BlogsService, BlogsRepository, BlogsQueryRepository],
  exports: [BlogsService],
})
export class BlogsModule {}
