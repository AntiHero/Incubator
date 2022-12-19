import {
  Column,
  Entity,
  ManyToOne,
  CreateDateColumn,
  PrimaryGeneratedColumn,
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
  userId: User;

  @Column('simple-json', { default: '{ "banDate": null, "isBanned": false }' })
  banInfo: BlogBanInfo;

  @CreateDateColumn()
  createdAt: Date;
}
