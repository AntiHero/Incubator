import { Module } from '@nestjs/common';

import { LikesModule } from './likes/likes.module';
import { PostsModule } from './posts/posts.module';
import { TypegooseModule } from 'nestjs-typegoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { BlogsModule } from './blogs/blogs.module';
import { UsersModule } from './users/users.module';
import { TokensModule } from './tokens/tokens.module';
import { AdminsModule } from './admins/admins.module';
import { getMongoConfig } from './configs/mongo.config';
import { TestingModule } from './testing/testing.module';
import { BloggersModule } from './bloggers/bloggers.module';
import { CommentsModule } from './comments/comments.module';
import { EmailManagerModule } from './email-manager/email-manager.module';
import { SecurityDevicesModule } from './security-devices/security-devices.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
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
    TokensModule,
    TestingModule,
    CommentsModule,
    EmailManagerModule,
    SecurityDevicesModule,
    AdminsModule,
    BloggersModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
