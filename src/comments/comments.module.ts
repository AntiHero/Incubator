import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Comment } from './entity/comment.entity';
import { User } from 'root/users/entity/user.entity';
import { CommentsService } from './comments.service';
import { UsersModule } from 'root/users/users.module';
import { CommentsController } from './comments.controller';
import { CommentLike } from 'root/likes/entity/like.entity';
import { CommentsRepository } from './adapter/comment.repository';
import { CommentsQueryRepository } from './adapter/comment-query.repository';

@Module({
  imports: [
    UsersModule,
    // TypegooseModule.forFeature([
    //   {
    //     typegooseClass: CommentModel,
    //     schemaOptions: { collection: 'comments' },
    //   },
    // ]),
    // TypegooseModule.forFeature([
    //   {
    //     typegooseClass: LikeModel,
    //     schemaOptions: { collection: 'likes' },
    //   },
    // ]),
    TypeOrmModule.forFeature([Comment, CommentLike, User]),
  ],
  controllers: [CommentsController],
  providers: [CommentsService, CommentsRepository, CommentsQueryRepository],
  exports: [CommentsService],
})
export class CommentsModule {}
