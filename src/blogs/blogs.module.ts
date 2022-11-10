import { Module } from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogsAdapter } from './adapter/mongoose';
import { BlogsController } from './blogs.controller';
import { blogsSchema } from './schemas/blogs.schema';
import { PostsModule } from 'root/posts/posts.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'blog', schema: blogsSchema }]),
    PostsModule,
  ],
  controllers: [BlogsController],
  providers: [BlogsService, BlogsAdapter],
  exports: [BlogsService, BlogsAdapter],
})
export class BlogsModule {}
