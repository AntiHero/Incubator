import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Subscription } from '../entity/subscription.entity';

@Injectable()
export class SubscriptionsRepository {
  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionsRepository: Repository<Subscription>,
  ) {}

  async create(userId: number, blogId: number) {
    try {
      await this.subscriptionsRepository.create({
        userId,
        blogId,
      });
    } catch (error) {
      console.error(error);

      return null;
    }
  }

  async delete(userId: number, blogId: number) {
    try {
      const { affected } = await this.subscriptionsRepository.delete({
        userId,
        blogId,
      });

      return affected;
    } catch (error) {
      console.error(error);

      return null;
    }
  }
}
