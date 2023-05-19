import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Subscription } from '../entity/subscription.entity';
import { SubscriptionStatus } from '../types';

@Injectable()
export class SubscriptionsRepository {
  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionsRepository: Repository<Subscription>,
  ) {}

  async create(userId: number, blogId: number) {
    try {
      await this.subscriptionsRepository.upsert(
        {
          userId,
          blogId,
          status: SubscriptionStatus.SUBSCRIBED,
        },
        {
          conflictPaths: ['userId', 'blogId'],
          skipUpdateIfNoValuesChanged: true,
        },
      );
    } catch (error) {
      console.error(error);

      return null;
    }
  }

  async unsubscribe(userId: number, blogId: number) {
    try {
      const { affected } = await this.subscriptionsRepository.update(
        {
          userId,
          blogId,
        },
        { status: SubscriptionStatus.UNSUBSCRIBED },
      );

      return affected;
    } catch (error) {
      console.error(error);

      return null;
    }
  }
}
