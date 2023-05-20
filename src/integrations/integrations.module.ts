import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';

import { TelegramModule } from 'root/telegram/telegram.module';
import { IntegrationsController } from './integrations.controller';
import { IntegrationService } from './service/integrations.service';
import { TelegramNotification } from './enitity/telegram-notification.entity';
import { TelegramNotificationQueryRepository } from './repository/telegram-notification.query-repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([TelegramNotification]),
    TelegramModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        apiKey: configService.get<string>('TELEGRAM_API_KEY'),
        url: configService.get<string>('TELEGRAM_WEBHOOK_ENDPOINT'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [IntegrationsController],
  providers: [IntegrationService, TelegramNotificationQueryRepository],
})
export class IntegrationsModule {}
