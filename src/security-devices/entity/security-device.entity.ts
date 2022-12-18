import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { User } from 'root/users/entity/user.entity';

@Entity('security_devices')
export class SecurityDevice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'uuid', default: () => 'gen_random_uuid()' })
  deviceId: string;

  @Column({ type: 'date', default: () => 'now()' })
  lastActiveDate: Date;

  @ManyToOne(() => User)
  user: User;
}
