import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';

import { CommentsService } from './comments.service';
import { CommentsAdapter } from './adapter/mongoose';
import { CommentModel } from './schemas/comment.schema';
import { CommentsController } from './comments.controller';
import { LikeModel } from 'root/likes/schemas/likes.schema';

@Module({
  imports: [
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
})
export class CommentsModule {}
