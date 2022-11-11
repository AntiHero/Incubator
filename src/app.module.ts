import * as dotenv from 'dotenv';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { LikesModule } from './likes/likes.module';
import { PostsModule } from './posts/posts.module';
import { BlogsModule } from './blogs/blogs.module';
import { TestingModule } from './testing/testing.module';
import { CommentsModule } from './comments/comments.module';
import { UsersController } from './users/users.controller';

dotenv.config();

const connectionURI = process.env.MONGODB_URL;

if (!connectionURI) throw new Error('Provide a Mongo connection string');

@Module({
  imports: [
    TestingModule,
    BlogsModule,
    PostsModule,
    CommentsModule,
    LikesModule,
    MongooseModule.forRoot(connectionURI),
  ],
  controllers: [UsersController],
})
export class AppModule {}
