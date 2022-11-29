import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';

import { BlogsModule } from 'root/blogs/blogs.module';
import { PostsModule } from 'root/posts/posts.module';
import { UsersModule } from 'root/users/users.module';
import { UserModel } from 'root/users/schema/users.schema';
import { BlogModel } from 'root/blogs/schemas/blogs.schema';
import { BanUsersForBlogService } from './ban-user.service';
import { BloggersUseresController } from './blogger-users.controller';
import { BloggersBlogsController } from './bloggers-blogs.controller';

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
        typegooseClass: UserModel,
        schemaOptions: { collection: 'users' },
      },
    ]),
    BlogsModule,
    PostsModule,
    UsersModule,
  ],
  controllers: [BloggersBlogsController, BloggersUseresController],
  providers: [BanUsersForBlogService],
})
export class BloggersModule {}
