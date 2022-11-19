import { Module } from '@nestjs/common';

import { BlogsModule } from 'root/blogs/blogs.module';
import { UsersModule } from 'root/users/users.module';
import { TestingController } from './testing.controller';
import { SecurityDevicesModule } from 'root/security-devices/security-devices.module';

@Module({
  imports: [BlogsModule, UsersModule, SecurityDevicesModule],
  controllers: [TestingController],
})
export class TestingModule {}
