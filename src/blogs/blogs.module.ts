import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Blog } from './entity/blog.entity';
import { BlogsController } from './blogs.controller';
import { Post } from 'root/posts/entity/post.entity';
import { User } from 'root/users/entity/user.entity';
import { BlogsService } from './services/blogs.service';
import { BlogsRepository } from './adapter/blogs.repository';
import { Comment } from 'root/comments/entity/comment.entity';
import { CommentLike, PostLike } from 'root/likes/entity/like.entity';
import { BlogsQueryRepository } from './adapter/blogs-query.repository';
import { CloudStrategy } from 'root/bloggers/application/strategies/cloud-strategy';
import { BlogImagesService } from 'root/bloggers/application/services/blog-images.service';
import { BlogImage } from 'root/bloggers/infrastructure/database/entities/blog-image.entity';
import { YandexCloudStrategy } from 'root/bloggers/application/strategies/yandex-cloud.strategy';
import { BlogImagesRepository } from 'root/bloggers/infrastructure/repositories/blog-image.repository';
import { PostImage } from 'root/bloggers/infrastructure/database/entities/post-image.entity';
import { SubscriptionsRepository } from './adapter/subscriptions.repository';
import { Subscription } from './entity/subscription.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Blog,
      Post,
      User,
      Comment,
      PostLike,
      PostImage,
      BlogImage,
      CommentLike,
      Subscription,
    ]),
  ],
  controllers: [BlogsController],
  providers: [
    BlogsService,
    BlogsRepository,
    BlogImagesService,
    BlogsQueryRepository,
    SubscriptionsRepository,
    {
      provide: 'BlogImagesRepository',
      useClass: BlogImagesRepository,
    },
    {
      provide: CloudStrategy,
      useClass: YandexCloudStrategy,
    },
  ],
  exports: [BlogsService],
})
export class BlogsModule {}
