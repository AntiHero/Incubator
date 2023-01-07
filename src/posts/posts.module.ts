import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Post } from './entity/post.entity';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { Blog } from 'root/blogs/entity/blog.entity';
import { User } from 'root/users/entity/user.entity';
import { Comment } from 'root/comments/entity/comment.entity';
import { PostsRepository } from './adapter/posts.repostitory';
import { CommentLike, PostLike } from 'root/likes/entity/like.entity';
import { BannedUser } from 'root/bloggers/entity/banned-user.entity';
import { PostsQueryRepository } from './adapter/posts-query.repository';
import { BanUsersByBloggerService } from 'root/bloggers/ban-users.service';
import { CheckBlogExistance } from 'root/@common/decorators/check-blog-existance.decorator';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Post,
      Blog,
      User,
      Comment,
      PostLike,
      BannedUser,
      CommentLike,
    ]),
  ],
  controllers: [PostsController],
  providers: [
    PostsService,
    PostsRepository,
    CheckBlogExistance,
    PostsQueryRepository,
    BanUsersByBloggerService,
  ],
  exports: [PostsService],
})
export class PostsModule {}
