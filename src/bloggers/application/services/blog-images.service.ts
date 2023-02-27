import { Injectable } from '@nestjs/common';

import type { BlogImageInputModel } from 'root/bloggers/@common/types';

import { ImageRepository } from 'root/@core/repositories/image-repository';

@Injectable()
export class BlogImagesService {
  public constructor(private readonly imageRepository: ImageRepository) {}

  async create(image: BlogImageInputModel) {
    return this.imageRepository.create(image);
  }
}
