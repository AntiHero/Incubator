import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Blog } from 'root/blogs/entity/blog.entity';
import { User } from 'root/users/entity/user.entity';
import { BlogsModule } from 'root/blogs/blogs.module';
import { PostsModule } from 'root/posts/posts.module';
import { UsersModule } from 'root/users/users.module';
import { BannedUser } from './entity/banned-user.entity';
import { BanUsersByBloggerService } from './ban-users.service';
import { BloggersUsersController } from './blogger-users.controller';
import { BloggersBlogsController } from './bloggers-blogs.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Blog, User, BannedUser]),
    BlogsModule,
    PostsModule,
    UsersModule,
  ],
  controllers: [BloggersBlogsController, BloggersUsersController],
  providers: [BanUsersByBloggerService],
  exports: [BanUsersByBloggerService],
})
export class BloggersModule {}
