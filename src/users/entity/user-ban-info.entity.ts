import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('user_ban_info')
export class UserBanInfo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamptz', nullable: true })
  banDate: Date;

  @Column({ nullable: true })
  banReason: string;

  @Column({ type: 'boolean', default: false })
  isBanned: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
