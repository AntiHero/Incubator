import { Module } from '@nestjs/common';
import { BlogsModule } from 'root/blogs/blogs.module';
import { TestingController } from './testing.controller';

@Module({
  imports: [BlogsModule],
  controllers: [TestingController],
})
export class TestingModule {}
