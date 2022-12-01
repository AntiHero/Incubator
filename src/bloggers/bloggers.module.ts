import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';

import { BlogsModule } from 'root/blogs/blogs.module';
import { PostsModule } from 'root/posts/posts.module';
import { UsersModule } from 'root/users/users.module';
import { UserModel } from 'root/users/schema/users.schema';
import { BlogModel } from 'root/blogs/schemas/blogs.schema';
import { BanUsersForBlogService } from './ban-user-for-blog.service';
import { BloggersUsersController } from './blogger-users.controller';
import { BloggersBlogsController } from './bloggers-blogs.controller';
import { BannedUserForEntityModel } from './schemas/banned-user-for-entity.schema';

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
    TypegooseModule.forFeature([
      {
        typegooseClass: BannedUserForEntityModel,
        schemaOptions: { collection: 'banned-users-for-entity' },
      },
    ]),
    BlogsModule,
    PostsModule,
    UsersModule,
  ],
  controllers: [BloggersBlogsController, BloggersUsersController],
  providers: [BanUsersForBlogService],
  exports: [BanUsersForBlogService],
})
export class BloggersModule {}
