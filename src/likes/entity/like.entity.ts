import {
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Post } from 'root/posts/entity/post.entity';
import { User } from 'root/users/entity/user.entity';
import { LikeStatuses } from 'root/@core/types/enum';
import { Comment } from 'root/comments/entity/comment.entity';

@Entity('post_likes')
export class PostLike {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Post, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'entityId' })
  entityId: Post;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  userId: User;

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

  @ManyToOne(() => Comment, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'entityId' })
  entityId: Comment;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  userId: User;

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
