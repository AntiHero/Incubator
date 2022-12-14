import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Post } from 'root/posts/entity/post.entity';
import { User } from 'root/users/entity/user.entity';

type BlogBanInfo = {
  banDate: Date | null;
  isBanned: boolean;
};

@Entity('blogs')
export class Blog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  websiteUrl: string;

  @ManyToOne(() => User)
  userId: User;

  @OneToMany(() => Post, (post) => post.blogId)
  posts: Post[];

  @Column('simple-json', { default: { banDate: null, isBanned: false } })
  banInfo: BlogBanInfo;

  @CreateDateColumn()
  createdAt: Date;
}
