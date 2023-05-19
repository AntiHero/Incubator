import {
  Column,
  Entity,
  ManyToOne,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Unique,
} from 'typeorm';

import { User } from 'root/users/entity/user.entity';
import { Blog } from './blog.entity';
import { SubscriptionStatus } from '../types';

@Entity('subscriptions')
@Unique(['blogId', 'userId'])
export class Subscription {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Blog, { onDelete: 'CASCADE' })
  blog: Blog;

  @Column()
  blogId: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @Column()
  userId: number;

  @Column({
    type: 'enum',
    enum: SubscriptionStatus,
    default: SubscriptionStatus.SUBSCRIBED,
  })
  status: SubscriptionStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
