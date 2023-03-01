import {
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { ImageType } from 'root/@core/types/enum';
import { Post } from 'root/posts/entity/post.entity';
import { PostImageDTO, PostImageInputModel } from 'root/bloggers/@common/types';

@Entity('post_images')
export class PostImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: ImageType,
  })
  type: ImageType;

  @Column()
  height: number;

  @Column({ nullable: true })
  url: string;

  @Column()
  width: number;

  @Column()
  size: number;

  @ManyToOne(() => Post, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'postId' })
  post: Post;

  @Column()
  postId: number;

  @CreateDateColumn()
  createdAt: Date;

  toDTO(): PostImageDTO {
    return {
      id: this.id,
      url: this.url,
      name: this.name,
      type: this.type,
      size: this.size,
      width: this.width,
      height: this.height,
      postId: this.postId,
      createdAt: this.createdAt.toISOString(),
    };
  }

  static create(image: PostImageInputModel): PostImage {
    const newImage = new PostImage();

    newImage.postId = image.postId;
    newImage.name = image.name;
    newImage.height = image.height;
    newImage.width = image.width;
    newImage.size = image.size;
    newImage.type = image.type;
    newImage.url = image.url;

    return newImage;
  }
}
