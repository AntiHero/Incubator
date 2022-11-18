import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';

import { BlogsService } from './blogs.service';
import { BlogsAdapter } from './adapter/mongoose';
import { BlogsController } from './blogs.controller';
import { BlogModel } from './schemas/blogs.schema';
import { PostModel } from 'root/posts/schemas/post.schema';
import { CommentModel } from 'root/comments/schemas/comment.schema';
import { LikeModel } from 'root/likes/schemas/likes.schema';

@Module({
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: BlogModel,
        schemaOptions: { collection: 'blogs' },
      },
    ]),
    TypegooseModule.forFeature([
      {
        typegooseClass: PostModel,
        schemaOptions: { collection: 'posts' },
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
  controllers: [BlogsController],
  providers: [BlogsService, BlogsAdapter],
  exports: [BlogsService],
})
export class BlogsModule {}
