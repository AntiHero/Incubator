import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { PostsModule } from './posts/posts.module';
import { LikesModule } from './likes/likes.module';
import { BlogsModule } from './blogs/blogs.module';
import { UsersModule } from './users/users.module';
import { TokensModule } from './tokens/tokens.module';
import { AdminsModule } from './admins/admins.module';
import { TestingModule } from './testing/testing.module';
import { ServiceModule } from './service/service.module';
import { BloggersModule } from './bloggers/bloggers.module';
import { CommentsModule } from './comments/comments.module';
import { getPostgresConfig } from './configs/postgres.config';
import { QuizGameModule } from './quiz-game/quiz-game.module';
import { EmailManagerModule } from './email-manager/email-manager.module';
import { SecurityDevicesModule } from './security-devices/security-devices.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getPostgresConfig,
    }),
    AuthModule,
    BlogsModule,
    PostsModule,
    LikesModule,
    UsersModule,
    AdminsModule,
    TokensModule,
    TestingModule,
    ServiceModule,
    CommentsModule,
    BloggersModule,
    QuizGameModule,
    EmailManagerModule,
    SecurityDevicesModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
