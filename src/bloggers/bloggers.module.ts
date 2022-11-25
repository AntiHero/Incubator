import { Module } from '@nestjs/common';

import { BlogsModule } from 'root/blogs/blogs.module';
import { BloggersController } from './bloggers.controller';

@Module({
  imports: [BlogsModule],
  controllers: [BloggersController],
})
export class BloggersModule {}
