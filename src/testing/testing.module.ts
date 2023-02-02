import { Module } from '@nestjs/common';

import { BlogsModule } from 'root/blogs/blogs.module';
import { UsersModule } from 'root/users/users.module';
import { TokensModule } from 'root/tokens/tokens.module';
import { TestingController } from './testing.controller';
import { BloggersModule } from 'root/bloggers/bloggers.module';
import { QuizGameModule } from 'root/quiz-game/pairs.module';
import { SecurityDevicesModule } from 'root/security-devices/security-devices.module';

@Module({
  imports: [
    BlogsModule,
    UsersModule,
    TokensModule,
    BloggersModule,
    QuizGameModule,
    SecurityDevicesModule,
  ],
  controllers: [TestingController],
})
export class TestingModule {}
