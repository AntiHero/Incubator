import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TelegramNotificationQueryRepository } from '../repository/telegram-notification.query-repository';

@Injectable()
export class IntegrationService {
  public constructor(
    private readonly telegramNotificationQueryRepository: TelegramNotificationQueryRepository,
    private readonly configService: ConfigService,
  ) {}

  public async getActivationLink(userId: number) {
    const activationCode =
      await this.telegramNotificationQueryRepository.getActivationCode(userId);
    const bot = this.configService.get<string>('TELEGRAM_BOT');

    return `${bot}?code=${activationCode}`;
  }
}
