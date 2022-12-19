import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from 'root/users/entity/user.entity';

@Entity('security_devices')
export class SecurityDevice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  ip: string;

  @Column({ type: 'uuid', default: () => 'gen_random_uuid()' })
  deviceId: string;

  @Column({ type: 'date', default: () => 'now()' })
  lastActiveDate: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  userId: User;
}
