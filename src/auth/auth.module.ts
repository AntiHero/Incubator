import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'root/users/users.module';
import { SecurityDevicesModule } from 'root/security-devices/security-devices.module';

@Module({
  imports: [UsersModule, SecurityDevicesModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
