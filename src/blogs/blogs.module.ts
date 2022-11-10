import { Module } from '@nestjs/common';

import { BlogsService } from './blogs.service';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogsAdapter } from './adapter/mongoose';
import { BlogsController } from './blogs.controller';
import { blogsSchema } from './schemas/blogs.schema';
import { postSchema } from 'root/posts/schemas/post.schema';
import { likeSchema } from 'root/likes/schemas/likes.schema';
import { commentSchema } from 'root/comments/schemas/comment.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'blog', schema: blogsSchema }]),
    MongooseModule.forFeature([{ name: 'post', schema: postSchema }]),
    MongooseModule.forFeature([{ name: 'like', schema: likeSchema }]),
    MongooseModule.forFeature([{ name: 'comment', schema: commentSchema }]),
  ],
  controllers: [BlogsController],
  providers: [BlogsService, BlogsAdapter],
  exports: [BlogsService],
})
export class BlogsModule {}
