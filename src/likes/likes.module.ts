import { Module } from '@nestjs/common';

import { LikesService } from './likes.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LikesController } from './likes.controller';
import { CommentLike, PostLike } from './entity/like.entity';
import { LikesRepository } from './adapter/likes.repository';

@Module({
  imports: [TypeOrmModule.forFeature([PostLike, CommentLike])],
  controllers: [LikesController],
  providers: [LikesService, LikesRepository],
  exports: [LikesService],
})
export class LikesModule {}
