import { forwardRef, Module } from '@nestjs/common';

import { BlogsService } from './blogs.service';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogsAdapter } from './adapter/mongoose';
import { BlogsController } from './blogs.controller';
import { blogsSchema } from './schemas/blogs.schema';
import { PostsModule } from 'root/posts/posts.module';
import { postSchema } from 'root/posts/schemas/post.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'blog', schema: blogsSchema }]),
    MongooseModule.forFeature([{ name: 'post', schema: postSchema }]),
    forwardRef(() => PostsModule),
  ],
  controllers: [BlogsController],
  providers: [BlogsService, BlogsAdapter],
  exports: [BlogsService],
})
export class BlogsModule {}
