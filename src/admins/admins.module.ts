import { Module } from '@nestjs/common';

import { AdminsService } from './admins.service';
import { LikesModule } from 'root/likes/likes.module';
import { UsersModule } from 'root/users/users.module';
import { AdminsController } from './admins.controller';
import { CommentsModule } from 'root/comments/comments.module';

@Module({
  imports: [UsersModule, CommentsModule, LikesModule],
  controllers: [AdminsController],
  providers: [AdminsService],
})
export class AdminsModule {}
