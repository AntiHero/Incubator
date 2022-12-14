import {
  Column,
  Entity,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Post } from 'root/posts/entity/post.entity';
import { User } from 'root/users/entity/user.entity';
import { LikeStatuses } from 'root/@common/types/enum';

@Entity('post-likes')
export class PostLike {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Post)
  @JoinColumn()
  entityId: Post;

  @OneToOne(() => User)
  @JoinColumn()
  userId: User;

  @Column()
  login: string;

  @Column({
    type: 'enum',
    enum: LikeStatuses,
    default: LikeStatuses.None,
  })
  likeStatus: LikeStatuses;

  @Column({ type: 'boolean', default: false })
  isBanned: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
