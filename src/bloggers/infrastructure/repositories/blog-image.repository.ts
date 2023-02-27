import { DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';

import type {
  BlogImageDTO,
  BlogImageInputModel,
} from 'root/bloggers/@common/types';

import { BlogImage } from '../database/entities/blog-image.entity';
import { ImageRepository } from 'root/@core/repositories/image-repository';

@Injectable()
export class BlogImagesRepository extends ImageRepository {
  constructor(private readonly dataSource: DataSource) {
    super();
  }

  async create(image: BlogImageInputModel): Promise<BlogImageDTO> {
    const blogImage = BlogImage.create(image);
    const savedImage = await this.dataSource.manager.save(blogImage);

    return savedImage.toDTO();
  }

  async findById(id: number): Promise<BlogImageDTO> {
    try {
      const result = await this.dataSource.getRepository(BlogImage).findOne({
        where: {
          id,
        },
      });

      return result?.toDTO() ?? null;
    } catch (error) {
      console.log(error);

      return null;
    }
  }

  async deleteById(id: number): Promise<boolean> {
    try {
      const result = (
        await this.dataSource.getRepository(BlogImage).delete({
          id: id,
        })
      ).affected;

      return result === 1;
    } catch (error) {
      console.log(error);

      return null;
    }
  }
}
