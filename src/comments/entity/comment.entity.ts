import {
  Column,
  Entity,
  ManyToOne,
  CreateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from 'root/users/entity/user.entity';
import { Post } from 'root/posts/entity/post.entity';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Post, { onDelete: 'CASCADE' })
  entity: Post;

  @Column()
  isBanned: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
