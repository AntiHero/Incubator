import { Module } from '@nestjs/common';

import { BlogsModule } from 'root/blogs/blogs.module';
import { PostsModule } from 'root/posts/posts.module';
import { UsersModule } from 'root/users/users.module';
import { BloggersUseresController } from './blogger-users.controller';
import { BloggersBlogsController } from './bloggers-blogs.controller';

@Module({
  imports: [BlogsModule, PostsModule, UsersModule],
  controllers: [BloggersBlogsController, BloggersUseresController],
})
export class BloggersModule {}
