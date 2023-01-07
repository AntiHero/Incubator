import {
  Column,
  Entity,
  OneToOne,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from 'root/users/entity/user.entity';
import { Blog } from 'root/blogs/entity/blog.entity';

@Entity('banned_users')
export class BannedUser {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User)
  @JoinColumn({ name: 'userId' })
  userId: User;

  @Column({ nullable: true })
  banReason: string;

  @ManyToOne(() => Blog)
  @JoinColumn({ name: 'entityId' })
  entityId: Blog;

  @Column({ type: 'boolean' })
  isBanned: boolean;

  @Column({ type: 'timestamptz' })
  banDate: Date;
}
