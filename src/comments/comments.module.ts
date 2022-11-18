import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';

import { CommentsService } from './comments.service';
import { CommentsAdapter } from './adapter/mongoose';
import { CommentModel } from './schemas/comment.schema';
import { CommentsController } from './comments.controller';

@Module({
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: CommentModel,
        schemaOptions: { collection: 'comments' },
      },
    ]),
  ],
  controllers: [CommentsController],
  providers: [CommentsService, CommentsAdapter],
})
export class CommentsModule {}
