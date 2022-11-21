import { Module } from '@nestjs/common';

import { PostsService } from './posts.service';
import { PostsAdapter } from './adapter/mongooose';
import { PostsController } from './posts.controller';
import { TypegooseModule } from 'nestjs-typegoose';
import { PostModel } from './schemas/post.schema';
import { BlogModel } from 'root/blogs/schemas/blogs.schema';
import { LikeModel } from 'root/likes/schemas/likes.schema';
import { CommentModel } from 'root/comments/schemas/comment.schema';
import { IsBlogExist } from 'root/@common/decorators/is-blog-exist.decorator';

@Module({
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: PostModel,
        schemaOptions: { collection: 'posts' },
      },
    ]),
    TypegooseModule.forFeature([
      {
        typegooseClass: BlogModel,
        schemaOptions: { collection: 'blogs' },
      },
    ]),
    TypegooseModule.forFeature([
      {
        typegooseClass: LikeModel,
        schemaOptions: { collection: 'likes' },
      },
    ]),
    TypegooseModule.forFeature([
      {
        typegooseClass: CommentModel,
        schemaOptions: { collection: 'comments' },
      },
    ]),
  ],
  controllers: [PostsController],
  providers: [PostsService, PostsAdapter, IsBlogExist],
  // exports: [PostsService],
})
export class PostsModule {}
