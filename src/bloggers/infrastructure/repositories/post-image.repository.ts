import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

import type {
  PostImageDTO,
  PostImageInputModel,
} from 'root/bloggers/@common/types';

import { ImageType, SortDirection } from 'root/@core/types/enum';
import { PostImage } from '../database/entities/post-image.entity';
import { Repository } from 'root/@core/repositories/post-image.repository';

@Injectable()
export class PostImagesRepository extends Repository {
  constructor(private readonly dataSource: DataSource) {
    super();
  }

  async create(image: PostImageInputModel): Promise<PostImageDTO> {
    const postImage = PostImage.create(image);
    const savedImage = await this.dataSource.manager.save(postImage);

    return savedImage.toDTO();
  }

  async findById(id: number): Promise<PostImageDTO> {
    try {
      const result = await this.dataSource.getRepository(PostImage).findOne({
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
        await this.dataSource.getRepository(PostImage).delete({
          id: id,
        })
      ).affected;

      return result === 1;
    } catch (error) {
      console.log(error);

      return null;
    }
  }

  async getImage(
    postId: string | number,
    imageType: ImageType,
  ): Promise<PostImageDTO> {
    try {
      const image = await this.dataSource.getRepository(PostImage).findOne({
        where: { postId: Number(postId), type: imageType },
        order: {
          createdAt: SortDirection.DESC,
        },
      });

      return image?.toDTO() ?? null;
    } catch (error) {
      console.log(error);

      return null;
    }
  }

  async getImages(postId: string | number): Promise<{ main: PostImageDTO[] }> {
    try {
      const main = await this.dataSource.getRepository(PostImage).find({
        where: { postId: Number(postId), type: ImageType.main },
      });

      return {
        main: main.map((img) => img.toDTO()),
      };
    } catch (error) {
      console.log(error);

      return null;
    }
  }

  async deleteAll(
    postId?: string | number,
    imageType?: ImageType,
  ): Promise<void> {
    const filter: { postId?: number; type?: ImageType } = {};

    if (postId) {
      filter.postId = Number(postId);
      filter.type = imageType;
    }

    try {
      await this.dataSource.getRepository(PostImage).delete(filter);
    } catch (error) {
      console.log(error);

      return null;
    }
  }
}
