import {
  Column,
  Entity,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Roles } from 'root/users/types/roles';

import { UserBanInfo } from './user-ban-info.entity';
import { PasswordRecovery } from './password-recovery.entity';
import { UserConfirmationInfo } from './user-confirmation-info.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  login: string;

  @Column()
  email: string;

  @Column({ select: false })
  password: string;

  @OneToOne(() => UserBanInfo)
  @JoinColumn({ name: 'banInfo' })
  banInfo: UserBanInfo;

  @OneToOne(() => UserConfirmationInfo)
  @JoinColumn({ name: 'confirmationInfo' })
  confirmationInfo: UserConfirmationInfo;

  @OneToOne(() => PasswordRecovery)
  @JoinColumn({ name: 'passwordRecovery' })
  passwordRecovery: PasswordRecovery;

  @Column({ type: 'enum', enum: Roles, default: Roles.USER })
  role: Roles;

  @CreateDateColumn()
  createdAt: Date;
}
