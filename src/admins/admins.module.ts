import { Module } from '@nestjs/common';

import { AdminsService } from './admins.service';
import { BlogsController } from './blogs.controller';
import { UsersController } from './users.controller';
import { BlogsModule } from 'root/blogs/blogs.module';
import { UsersModule } from 'root/users/users.module';
import { LikesModule } from 'root/likes/likes.module';
import { CommentsModule } from 'root/comments/comments.module';

@Module({
  imports: [UsersModule, CommentsModule, LikesModule, BlogsModule],
  controllers: [UsersController, BlogsController],
  providers: [AdminsService],
})
export class AdminsModule {}
