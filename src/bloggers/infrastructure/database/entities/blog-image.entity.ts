import {
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { ImageType } from 'root/@core/types/enum';
import { Blog } from 'root/blogs/entity/blog.entity';
import { BlogImageDTO, BlogImageInputModel } from 'root/bloggers/@common/types';

@Entity('blog_images')
export class BlogImage {
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

  @ManyToOne(() => Blog, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'blogId' })
  blog: Blog;

  @CreateDateColumn()
  createdAt: Date;

  toDTO(): BlogImageDTO {
    return {
      id: this.id,
      url: this.url,
      name: this.name,
      type: this.type,
      size: this.size,
      width: this.width,
      height: this.height,
      blogId: this.blog.id,
      createdAt: this.createdAt.toISOString(),
    };
  }

  static create(image: BlogImageInputModel): BlogImage {
    const newImage = new BlogImage();
    newImage.blog = <Blog>{ id: image.blogId };
    newImage.name = image.name;
    newImage.height = image.height;
    newImage.width = image.width;
    newImage.size = image.size;
    newImage.type = image.type;
    newImage.url = image.url;

    return newImage;
  }
}
