import { v4 as uuidv4 } from 'uuid';
import { Column, Entity, Generated, PrimaryGeneratedColumn } from 'typeorm';

import { fiveMinInMs } from 'root/@common/constants';

@Entity('user_confirmation_info')
export class UserConfirmationInfo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'bigint', default: Date.now() + fiveMinInMs })
  expDate: number;

  @Column()
  @Generated('uuid')
  code: string;

  @Column({ type: 'boolean', default: false })
  isConfirmed: boolean;
}
