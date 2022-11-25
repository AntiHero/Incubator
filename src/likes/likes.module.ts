import { Module } from '@nestjs/common';

import { LikesService } from './likes.service';
import { LikesAdapter } from './adapter/mongoose';
import { TypegooseModule } from 'nestjs-typegoose';
import { LikeModel } from './schemas/likes.schema';
import { LikesController } from './likes.controller';

@Module({
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: LikeModel,
        schemaOptions: { collection: 'likes' },
      },
    ]),
  ],
  controllers: [LikesController],
  providers: [LikesService, LikesAdapter],
  exports: [LikesService],
})
export class LikesModule {}
