import { Module } from '@nestjs/common';

import { UsersService } from './users.service';
import { UsersAdapter } from './adapter/mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { userSchema } from './schema/users.schema';
import { UsersController } from './users.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'user', schema: userSchema }])],
  controllers: [UsersController],
  providers: [UsersService, UsersAdapter],
  exports: [UsersService],
})
export class UsersModule {}
