import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Comment } from './entity/comment.entity';
import { User } from 'root/users/entity/user.entity';
import { CommentsService } from './comments.service';
import { UsersModule } from 'root/users/users.module';
import { CommentsController } from './comments.controller';
import { CommentLike } from 'root/likes/entity/like.entity';
import { CommentsRepository } from './adapter/comment.repository';
import { UserBanInfo } from 'root/users/entity/user-ban-info.entity';
import { CommentsQueryRepository } from './adapter/comment-query.repository';

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([Comment, CommentLike, User, UserBanInfo]),
  ],
  controllers: [CommentsController],
  providers: [CommentsService, CommentsRepository, CommentsQueryRepository],
  exports: [CommentsService],
})
export class CommentsModule {}
