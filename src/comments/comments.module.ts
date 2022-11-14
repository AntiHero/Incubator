import { Module } from '@nestjs/common';

import { CommentsService } from './comments.service';
import { CommentsAdapter } from './adapter/mongoose';
import { CommentsController } from './comments.controller';
import { TypegooseModule } from 'nestjs-typegoose';
import { CommentModel } from './schemas/comment.schema';

@Module({
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: CommentModel,
        schemaOptions: { collection: 'comment' },
      },
    ]),
  ],
  controllers: [CommentsController],
  providers: [CommentsService, CommentsAdapter],
})
export class CommentsModule {}
