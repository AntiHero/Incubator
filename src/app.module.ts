import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { SecurityDevicesModule } from './security-devices/security-devices.module';
import { EmailManagerModule } from './email-manager/email-manager.module';
import { QuizGameModule } from './quiz-game/application/pairs.module';
import { getPostgresConfig } from './configs/postgres.config';
import { CommentsModule } from './comments/comments.module';
import { BloggersModule } from './bloggers/bloggers.module';
import { ChatModule } from './gateways/chat/chat.module';
import { ServiceModule } from './service/service.module';
import { TestingModule } from './testing/testing.module';
import { AdminsModule } from './admins/admins.module';
import { TokensModule } from './tokens/tokens.module';
import { UsersModule } from './users/users.module';
import { BlogsModule } from './blogs/blogs.module';
import { LikesModule } from './likes/likes.module';
import { PostsModule } from './posts/posts.module';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getPostgresConfig,
    }),
    SecurityDevicesModule,
    EmailManagerModule,
    BloggersModule,
    QuizGameModule,
    CommentsModule,
    ServiceModule,
    TestingModule,
    TokensModule,
    AdminsModule,
    UsersModule,
    LikesModule,
    PostsModule,
    BlogsModule,
    AuthModule,
    ChatModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
