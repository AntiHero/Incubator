import { Module } from '@nestjs/common';

import { BlogsModule } from 'root/blogs/blogs.module';
import { PostsModule } from 'root/posts/posts.module';
import { BloggersController } from './bloggers.controller';

@Module({
  imports: [BlogsModule, PostsModule],
  controllers: [BloggersController],
})
export class BloggersModule {}
