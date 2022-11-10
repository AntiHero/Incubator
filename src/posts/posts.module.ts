import { Module } from '@nestjs/common';

import { PostsService } from './posts.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PostsAdapter } from './adapter/mongooose';
import { postSchema } from './schemas/post.schema';
import { PostsController } from './posts.controller';
import { blogsSchema } from 'root/blogs/schemas/blogs.schema';
import { likeSchema } from 'root/likes/schemas/likes.schema';
import { commentSchema } from 'root/comments/schemas/comment.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'post', schema: postSchema }]),
    MongooseModule.forFeature([{ name: 'blog', schema: blogsSchema }]),
    MongooseModule.forFeature([{ name: 'like', schema: likeSchema }]),
    MongooseModule.forFeature([{ name: 'comment', schema: commentSchema }]),
  ],
  controllers: [PostsController],
  providers: [PostsService, PostsAdapter],
  exports: [PostsService],
})
export class PostsModule {}
