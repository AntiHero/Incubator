import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CommentsService } from './comments.service';
import { CommentsAdapter } from './adapter/mongoose';
import { CommentsController } from './comments.controller';
import { likeSchema } from 'root/likes/schemas/likes.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'comment', schema: likeSchema }]),
  ],
  controllers: [CommentsController],
  providers: [CommentsService, CommentsAdapter],
})
export class CommentsModule {}
