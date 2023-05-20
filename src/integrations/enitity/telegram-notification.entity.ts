import {
  Entity,
  CreateDateColumn,
  JoinColumn,
  OneToOne,
  UpdateDateColumn,
  Column,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from 'root/users/entity/user.entity';

@Entity('telegram_notifications')
export class TelegramNotification {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, (user) => user.telegramNotification, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: User;

  @Column()
  userId: number;

  @Column({ nullable: true })
  chatId: string;

  @Column({ type: 'uuid', default: () => 'uuid_generate_v4()' })
  code: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
