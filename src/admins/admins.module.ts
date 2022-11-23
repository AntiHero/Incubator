import { Module } from '@nestjs/common';

import { UsersModule } from 'root/users/users.module';
import { AdminsController } from './admins.controller';

@Module({
  imports: [UsersModule],
  controllers: [AdminsController],
})
export class AdminsModule {}
