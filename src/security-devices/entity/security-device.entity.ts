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

  // @Column({ type: 'uuid', default: () => 'gen_random_uuid()' })
  @Column({ type: 'uuid', default: () => 'uuid_generate_v4()' })
  deviceId: string;

  @Column({ type: 'timestamptz' })
  lastActiveDate: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  userId: User;
}
