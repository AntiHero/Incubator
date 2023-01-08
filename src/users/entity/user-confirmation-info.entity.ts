import {
  Column,
  Entity,
  OneToOne,
  Generated,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('users_confirmation_info')
export class UserConfirmationInfo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'bigint' })
  expDate: number;

  @OneToOne(() => User)
  @JoinColumn({ name: 'userId' })
  userId: User;

  @Column()
  @Generated('uuid')
  code: string;

  @Column({ type: 'boolean', default: false })
  isConfirmed: boolean;
}
