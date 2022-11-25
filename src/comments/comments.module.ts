import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';

import { CommentsService } from './comments.service';
import { CommentsAdapter } from './adapter/mongoose';
import { UsersModule } from 'root/users/users.module';
import { CommentModel } from './schemas/comment.schema';
import { CommentsController } from './comments.controller';
import { LikeModel } from 'root/likes/schemas/likes.schema';

@Module({
  imports: [
    UsersModule,
    TypegooseModule.forFeature([
      {
        typegooseClass: CommentModel,
        schemaOptions: { collection: 'comments' },
      },
    ]),
    TypegooseModule.forFeature([
      {
        typegooseClass: LikeModel,
        schemaOptions: { collection: 'likes' },
      },
    ]),
  ],
  controllers: [CommentsController],
  providers: [CommentsService, CommentsAdapter],
  exports: [CommentsService],
})
export class CommentsModule {}
