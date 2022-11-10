import { forwardRef, Module } from '@nestjs/common';

import { PostsService } from './posts.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PostsAdapter } from './adapter/mongooose';
import { postSchema } from './schemas/post.schema';
import { PostsController } from './posts.controller';
import { BlogsModule } from 'root/blogs/blogs.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'post', schema: postSchema }]),
    forwardRef(() => BlogsModule),
  ],
  controllers: [PostsController],
  providers: [PostsService, PostsAdapter],
  exports: [PostsService],
})
export class PostsModule {}
