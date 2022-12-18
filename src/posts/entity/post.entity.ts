import {
  Column,
  Entity,
  ManyToOne,
  CreateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Blog } from 'root/blogs/entity/blog.entity';

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  shortDescription: string;

  @ManyToOne(() => Blog, { onDelete: 'CASCADE' })
  blog: Blog;

  @CreateDateColumn()
  createdAt: Date;
}
