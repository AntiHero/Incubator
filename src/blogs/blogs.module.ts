import { Module } from '@nestjs/common';

import { Blog } from './entity/blog.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogsController } from './blogs.controller';
import { Post } from 'root/posts/entity/post.entity';
import { User } from 'root/users/entity/user.entity';
import { BlogsService } from './services/blogs.service';
import { BlogsRepository } from './adapter/blogs.repository';
import { Comment } from 'root/comments/entity/comment.entity';
import { CommentLike, PostLike } from 'root/likes/entity/like.entity';
import { BlogsQueryRepository } from './adapter/blogs-query.repository';
import { ImageRepository } from 'root/@core/repositories/image-repository';
import { BlogImagesService } from 'root/bloggers/application/services/blog-images-deprecated.service';
import { BlogImage } from 'root/bloggers/infrastructure/database/entities/blog-image.entity';
import { BlogImagesRepository } from 'root/bloggers/infrastructure/repositories/blog-image.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Blog,
      Post,
      User,
      Comment,
      PostLike,
      BlogImage,
      CommentLike,
    ]),
  ],
  controllers: [BlogsController],
  providers: [
    BlogsService,
    BlogsRepository,
    BlogImagesService,
    BlogsQueryRepository,
    {
      provide: ImageRepository,
      useClass: BlogImagesRepository,
    },
  ],
  exports: [BlogsService],
})
export class BlogsModule {}
