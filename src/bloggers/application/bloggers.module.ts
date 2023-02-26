import { ConfigService } from '@nestjs/config';
import { Storage } from '@google-cloud/storage';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module, HttpStatus } from '@nestjs/common';

import type { StorageConfig } from 'root/@core/types';

import { Blog } from 'root/blogs/entity/blog.entity';
import { User } from 'root/users/entity/user.entity';
import { BlogsModule } from 'root/blogs/blogs.module';
import { PostsModule } from 'root/posts/posts.module';
import { UsersModule } from 'root/users/users.module';
import { CloudService } from './services/cloud.service';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { BloggersUsersController } from './controllers/blogger-users.controller';
import { BannedUser } from '../infrastructure/database/entities/banned-user.entity';
import { BanUsersByBloggerService } from 'root/bloggers/application/services/ban-users.service';
import { BloggersBlogsController } from 'root/bloggers/application/controllers/bloggers-blogs.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Blog, User, BannedUser]),
    BlogsModule,
    PostsModule,
    UsersModule,
  ],
  controllers: [BloggersBlogsController, BloggersUsersController],
  providers: [
    BanUsersByBloggerService,
    {
      provide: Storage,
      useFactory(configService: ConfigService) {
        try {
          const StorageConfig: StorageConfig = JSON.parse(
            configService.get<string>('CLOUD_STORAGE_CREDENTIALS'),
          );

          return new Storage({
            projectId: StorageConfig.project_id,
            credentials: {
              client_email: StorageConfig.client_email,
              private_key: StorageConfig.private_key,
            },
          });
        } catch (err) {
          throw new HttpException(
            'Bad Google Cloud creds',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
      },
      inject: [ConfigService],
    },
    CloudService,
  ],
  exports: [BanUsersByBloggerService],
})
export class BloggersModule {}
