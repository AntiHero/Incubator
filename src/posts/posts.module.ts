import { Module } from '@nestjs/common';

import { PostsService } from './posts.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PostsAdapter } from './adapter/mongooose';
import { postSchema } from './schemas/post.schema';
import { PostsController } from './posts.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'post', schema: postSchema }])],
  controllers: [PostsController],
  providers: [PostsService, PostsAdapter],
  exports: [PostsService],
})
export class PostsModule {}
