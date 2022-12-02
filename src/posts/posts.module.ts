import { Module } from '@nestjs/common';

import { PostsService } from './posts.service';
import { PostsAdapter } from './adapter/mongooose';
import { PostsController } from './posts.controller';
import { TypegooseModule } from 'nestjs-typegoose';
import { PostModel } from './schemas/post.schema';
import { BlogModel } from 'root/blogs/schemas/blogs.schema';
import { LikeModel } from 'root/likes/schemas/likes.schema';
import { CommentModel } from 'root/comments/schemas/comment.schema';
import { IsBlogExist } from 'root/@common/decorators/is-blog-exist.decorator';
import { BanUsersForBlogService } from 'root/bloggers/ban-user-for-blog.service';
import { BannedUserForEntityModel } from 'root/bloggers/schemas/banned-user-for-entity.schema';

@Module({
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: PostModel,
        schemaOptions: { collection: 'posts' },
      },
    ]),
    TypegooseModule.forFeature([
      {
        typegooseClass: BlogModel,
        schemaOptions: { collection: 'blogs' },
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
    TypegooseModule.forFeature([
      {
        typegooseClass: BannedUserForEntityModel,
        schemaOptions: { collection: 'banned-users-for-entity' },
      },
    ]),
  ],
  controllers: [PostsController],
  providers: [PostsService, PostsAdapter, IsBlogExist, BanUsersForBlogService],
  exports: [PostsService],
})
export class PostsModule {}
