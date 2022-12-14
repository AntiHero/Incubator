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

  @ManyToOne(() => Blog, (blog) => blog.posts)
  blogId: Blog;

  @CreateDateColumn()
  createdAt: Date;
}
