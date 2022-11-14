import { Module } from '@nestjs/common';

import { PostsService } from './posts.service';
import { PostsAdapter } from './adapter/mongooose';
import { PostsController } from './posts.controller';
import { TypegooseModule } from 'nestjs-typegoose';
import { PostModel } from './schemas/post.schema';
import { BlogModel } from 'root/blogs/schemas/blogs.schema';
import { LikeModel } from 'root/likes/schemas/likes.schema';
import { CommentModel } from 'root/comments/schemas/comment.schema';

@Module({
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: PostModel,
        schemaOptions: { collection: 'post' },
      },
    ]),
    TypegooseModule.forFeature([
      {
        typegooseClass: BlogModel,
        schemaOptions: { collection: 'blog' },
      },
    ]),
    TypegooseModule.forFeature([
      {
        typegooseClass: LikeModel,
        schemaOptions: { collection: 'like' },
      },
    ]),
    TypegooseModule.forFeature([
      {
        typegooseClass: CommentModel,
        schemaOptions: { collection: 'comment' },
      },
    ]),
  ],
  controllers: [PostsController],
  providers: [PostsService, PostsAdapter],
  exports: [PostsService],
})
export class PostsModule {}
