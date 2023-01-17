import {
  Column,
  Entity,
  CreateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Roles } from 'root/users/types/roles';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  login: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ type: 'enum', enum: Roles, default: Roles.USER })
  role: Roles;

  @CreateDateColumn()
  createdAt: Date;
}
