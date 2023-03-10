import { Module } from '@nestjs/common';

import { SecurityDevicesModule } from 'root/security-devices/security-devices.module';
import { QuizGameModule } from 'root/quiz-game/application/pairs.module';
import { BloggersModule } from 'root/bloggers/bloggers.module';
import { TestingController } from './testing.controller';
import { TokensModule } from 'root/tokens/tokens.module';
import { BlogsModule } from 'root/blogs/blogs.module';
import { UsersModule } from 'root/users/users.module';

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
