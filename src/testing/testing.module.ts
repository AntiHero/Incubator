import { Module } from '@nestjs/common';
import { BlogsModule } from 'root/blogs/blogs.module';
import { UsersModule } from 'root/users/users.module';
import { TestingController } from './testing.controller';

@Module({
  imports: [BlogsModule, UsersModule],
  controllers: [TestingController],
})
export class TestingModule {}
