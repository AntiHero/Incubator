import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EmailManager } from './email-manager';

@Module({
  imports: [ConfigModule],
  providers: [EmailManager],
  exports: [EmailManager],
})
export class EmailManagerModule {}
