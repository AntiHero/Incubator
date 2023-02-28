import { Injectable } from '@nestjs/common';

import type { BlogImageInputModel } from 'root/bloggers/@common/types';

import { ImageType } from 'root/@core/types/enum';
import { ImageRepository } from 'root/@core/repositories/image-repository';

@Injectable()
export class BlogImagesService {
  public constructor(private readonly imageRepository: ImageRepository) {}

  async create(image: BlogImageInputModel) {
    return this.imageRepository.create(image);
  }

  async getImage(blogId: string, imageType: ImageType) {
    return this.imageRepository.getImage(blogId, imageType);
  }

  async getImages(blogId: string) {
    return this.imageRepository.getImages(blogId);
  }
}
