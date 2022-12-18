import {
  Column,
  Entity,
  OneToOne,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Post } from 'root/posts/entity/post.entity';
import { User } from 'root/users/entity/user.entity';
import { LikeStatuses } from 'root/@common/types/enum';
import { Comment } from 'root/comments/entity/comment.entity';

@Entity('post_likes')
export class PostLike {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Post)
  @JoinColumn()
  entity: Post;

  @ManyToOne(() => User)
  user: User;

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

@Entity('comment_likes')
export class CommentLike {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Comment)
  @JoinColumn()
  entity: Comment;

  @ManyToOne(() => User)
  user: User;

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
