import { Module } from '@nestjs/common';

import { LikesModule } from './likes/likes.module';
import { PostsModule } from './posts/posts.module';
import { TypegooseModule } from 'nestjs-typegoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { BlogsModule } from './blogs/blogs.module';
import { UsersModule } from './users/users.module';
import { getMongoConfig } from './configs/mongo.config';
import { TestingModule } from './testing/testing.module';
import { CommentsModule } from './comments/comments.module';
import { EmailManagerModule } from './email-manager/email-manager.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypegooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getMongoConfig,
    }),
    AuthModule,
    BlogsModule,
    PostsModule,
    LikesModule,
    UsersModule,
    TestingModule,
    CommentsModule,
    EmailManagerModule,
  ],
})
export class AppModule {}
