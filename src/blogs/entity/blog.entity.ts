import {
  Column,
  Entity,
  ManyToOne,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';

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

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  userId: User;

  @Column('simple-json', { default: '{ "banDate": null, "isBanned": false }' })
  banInfo: BlogBanInfo;

  @CreateDateColumn()
  createdAt: Date;
}
