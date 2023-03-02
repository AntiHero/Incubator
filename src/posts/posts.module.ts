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
import { PostsQueryRepository } from './adapter/posts-query.repository';
import { CheckBlogExistance } from 'root/@core/decorators/check-blog-existance.decorator';
import { BannedUser } from 'root/bloggers/infrastructure/database/entities/banned-user.entity';
import { BanUsersByBloggerService } from 'root/bloggers/application/services/ban-users.service';
import { PostImagesRepository } from 'root/bloggers/infrastructure/repositories/post-image.repository';
import { PostImage } from 'root/bloggers/infrastructure/database/entities/post-image.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Post,
      Blog,
      User,
      Comment,
      PostLike,
      PostImage,
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
    {
      provide: 'PostImagesRepository',
      useClass: PostImagesRepository,
    },
  ],
  exports: [PostsService],
})
export class PostsModule {}
