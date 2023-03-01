// import { ConfigService } from '@nestjs/config';
// import { Storage } from '@google-cloud/storage';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

// import type { StorageConfig } from 'root/@core/types';

import { Blog } from 'root/blogs/entity/blog.entity';
import { User } from 'root/users/entity/user.entity';
import { BlogsModule } from 'root/blogs/blogs.module';
import { PostsModule } from 'root/posts/posts.module';
import { UsersModule } from 'root/users/users.module';
import { CloudStrategy } from './strategies/cloud-strategy';
import { BlogImagesService } from './services/blog-images.service';
import { PostsImagesService } from './services/post-images.service';
import { YandexCloudStrategy } from './strategies/yandex-cloud.strategy';
import { BloggersUsersController } from './controllers/blogger-users.controller';
import { PostImage } from '../infrastructure/database/entities/post-image.entity';
import { BlogImage } from '../infrastructure/database/entities/blog-image.entity';
import { BannedUser } from '../infrastructure/database/entities/banned-user.entity';
import { PostImagesRepository } from '../infrastructure/repositories/post-image.repository';
import { BlogImagesRepository } from '../infrastructure/repositories/blog-image.repository';
import { BanUsersByBloggerService } from 'root/bloggers/application/services/ban-users.service';
import { BloggersBlogsController } from 'root/bloggers/application/controllers/bloggers-blogs.controller';
// import { GoogleCloudStrategy } from './strategies/google-cloud.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([Blog, User, BannedUser, BlogImage, PostImage]),
    BlogsModule,
    PostsModule,
    UsersModule,
  ],
  controllers: [BloggersBlogsController, BloggersUsersController],
  providers: [
    BanUsersByBloggerService,
    // {
    //   provide: Storage,
    //   useFactory(configService: ConfigService) {
    //     try {
    //       const StorageConfig: StorageConfig = JSON.parse(
    //         configService.get<string>('CLOUD_STORAGE_CREDENTIALS'),
    //       );

    //       return new Storage({
    //         projectId: StorageConfig.project_id,
    //         credentials: {
    //           client_email: StorageConfig.client_email,
    //           private_key: StorageConfig.private_key,
    //         },
    //       });
    //     } catch (err) {
    //       throw new HttpException(
    //         'Bad Google Cloud creds',
    //         HttpStatus.INTERNAL_SERVER_ERROR,
    //       );
    //     }
    //   },
    //   inject: [ConfigService],
    // },
    // CloudService,
    // BlogImagesService,
    BlogImagesService,
    PostsImagesService,
    {
      provide: 'BlogImagesRepository',
      useClass: BlogImagesRepository,
    },
    {
      provide: 'PostImagesRepository',
      useClass: PostImagesRepository,
    },
    {
      provide: CloudStrategy,
      useClass: YandexCloudStrategy,
      // useClass: GoogleCloudStrategy,
    },
  ],
  exports: [BanUsersByBloggerService],
})
export class BloggersModule {}
