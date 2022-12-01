import { Module } from '@nestjs/common';

import { BlogsModule } from 'root/blogs/blogs.module';
import { UsersModule } from 'root/users/users.module';
import { TokensModule } from 'root/tokens/tokens.module';
import { TestingController } from './testing.controller';
import { SecurityDevicesModule } from 'root/security-devices/security-devices.module';
import { AdminsModule } from 'root/admins/admins.module';
import { BloggersModule } from 'root/bloggers/bloggers.module';

@Module({
  imports: [
    BlogsModule,
    UsersModule,
    SecurityDevicesModule,
    TokensModule,
    BloggersModule,
  ],
  controllers: [TestingController],
})
export class TestingModule {}
