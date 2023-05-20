import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { TelegramNotification } from '../enitity/telegram-notification.entity';

@Injectable()
export class TelegramNotificationQueryRepository {
  constructor(
    @InjectRepository(TelegramNotification)
    private readonly telegramNotificationRepository: Repository<TelegramNotification>,
  ) {}

  async getActivationCode(userId: number) {
    try {
      let notification = await this.telegramNotificationRepository.findOne({
        where: {
          userId,
        },
      });

      if (!notification) {
        notification = await this.telegramNotificationRepository.save({
          userId,
        });
      }

      return notification.code;
    } catch (error) {
      console.error(error);

      return null;
    }
  }
}
