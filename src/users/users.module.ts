import { Module } from '@nestjs/common';

import { UsersService } from './users.service';
import { UsersAdapter } from './adapter/mongoose';
import { UserModel } from './schema/users.schema';
import { TypegooseModule } from 'nestjs-typegoose';
import { UsersController } from './users.controller';

@Module({
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: UserModel,
        schemaOptions: { collection: 'user' },
      },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersAdapter],
  exports: [UsersService],
})
export class UsersModule {}
